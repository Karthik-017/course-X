const { Router } = require("express");
const adminRouter = Router();
const prisma = require("../prismaClient");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  await prisma.admin.create({
    data: { email, password, firstName, lastName },
  });
  res.json({ message: "signup success" });
});

adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({
    where: { email },
  });
  if (admin && admin.password === password) {
    const token = jwt.sign({ id: admin.id }, JWT_ADMIN_PASSWORD);
    res.json({ token });
  } else {
    res.status(403).json({ message: "Incorrect credentials" });
  }
});

// Create a new course
adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price, sections } = req.body;
  
  try {
    // Create course with optional nested sections and content
    const course = await prisma.course.create({
      data: {
        title, 
        description, 
        imageUrl, 
        price, 
        creatorId: adminId,
        sections: sections ? {
          create: sections.map((section, sIndex) => ({
            title: section.title,
            order: section.order || sIndex + 1,
            contents: section.contents ? {
              create: section.contents.map((content, cIndex) => ({
                title: content.title,
                type: content.type,
                url: content.url,
                text: content.text,
                duration: content.duration,
                order: content.order || cIndex + 1
              }))
            } : undefined
          }))
        } : undefined
      },
      include: {
        sections: {
          include: {
            contents: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    res.json({ message: "course created", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course", details: error.message });
  }
});

// adminRouter.put("/course", adminMiddleware, async (req, res) => {
//   const adminId = req.userId; // Authenticated admin ID
//   const { title, description, imageUrl, price, courseId } = req.body;

//   try {
//     // Check if course exists and belongs to this admin
//     const course = await prisma.course.findUnique({
//       where: { id: courseId },
//     });

//     if (!course) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     if (course.creatorId !== adminId) {
//       return res.status(403).json({ error: "Not authorized to edit this course" });
//     }

//     const updatedCourse = await prisma.course.update({
//       where: { id: courseId },
//       data: { title, description, imageUrl, price },
//     });

//     res.json({ message: "Course updated successfully", course: updatedCourse });

//   } catch (error) {
//     console.error("Error updating course:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId; // Authenticated admin ID
  const { title, description, imageUrl, price, courseId } = req.body;

  try {
    // Convert courseId to integer
    const courseIdInt = parseInt(courseId, 10);
    if (isNaN(courseIdInt)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    // Check if course exists and belongs to this admin
    const course = await prisma.course.findUnique({
      where: { id: courseIdInt },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.creatorId !== adminId) {
      return res.status(403).json({ error: "Not authorized to edit this course" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseIdInt },
      data: { title, description, imageUrl, price },
    });

    res.json({ message: "Course updated successfully", course: updatedCourse });

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const courses = await prisma.course.findMany({
    where: { creatorId: adminId },
  });
  res.json({ message: "courses found", courses });
});

adminRouter.get("/course/:courseId", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const courseId = parseInt(req.params.courseId);
  
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            contents: {
              orderBy: {
                order: 'asc'
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    if (course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to access this course" });
    }
    
    res.json({ message: "Course found", course });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.delete("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { courseId } = req.body;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// SECTION ROUTES

// Create a new section for a course
adminRouter.post("/section", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { courseId, title, order } = req.body;
  
  try {
    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    if (course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to modify this course" });
    }
    
    // Get highest order if not specified
    let sectionOrder = order;
    if (!sectionOrder) {
      const highestOrderSection = await prisma.section.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' }
      });
      sectionOrder = highestOrderSection ? highestOrderSection.order + 1 : 1;
    }
    
    // Create the section
    const section = await prisma.section.create({
      data: {
        title,
        order: sectionOrder,
        courseId
      }
    });
    
    res.json({ message: "Section created successfully", section });
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(500).json({ error: "Failed to create section" });
  }
});

// Update a section
adminRouter.put("/section/:sectionId", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const sectionId = parseInt(req.params.sectionId);
  const { title, order } = req.body;
  
  try {
    // Get the section with its course to verify ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true }
    });
    
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    
    if (section.course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to modify this section" });
    }
    
    // Only update the title if provided
    const updateData = { title: title !== undefined ? title : section.title };
    
    // We'll ignore manual order updates since we should use the reordering endpoint instead
    // This keeps the section creation and update logic simpler
    
    // Update the section
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: updateData
    });
    
    res.json({ message: "Section updated successfully", section: updatedSection });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ error: "Failed to update section" });
  }
});

// Get all sections for a course
adminRouter.get("/course/:courseId/sections", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const courseId = parseInt(req.params.courseId);
  
  try {
    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    if (course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to access this course" });
    }
    
    // Get all sections for the course
    const sections = await prisma.section.findMany({
      where: { courseId },
      include: { contents: true },
      orderBy: { order: 'asc' }
    });
    
    res.json({ message: "Sections retrieved successfully", sections });
  } catch (error) {
    console.error("Error retrieving sections:", error);
    res.status(500).json({ error: "Failed to retrieve sections" });
  }
});

// Delete a section
adminRouter.delete("/section/:sectionId", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const sectionId = parseInt(req.params.sectionId);
  
  try {
    // Get the section with its course to verify ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true }
    });
    
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    
    if (section.course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to delete this section" });
    }
    
    // Delete the section (this will cascade delete associated contents)
    await prisma.section.delete({
      where: { id: sectionId }
    });
    
    res.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({ error: "Failed to delete section" });
  }
});

// CONTENT ROUTES

// Create new content in a section
adminRouter.post("/content", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { sectionId, title, type, url, text, duration } = req.body;
  
  try {
    // Get the section with course to verify ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true }
    });
    
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    
    if (section.course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to modify this section" });
    }
    
    // Always get the highest order and add 1
    const highestOrderContent = await prisma.content.findFirst({
      where: { sectionId },
      orderBy: { order: 'desc' }
    });
    const newOrder = highestOrderContent ? highestOrderContent.order + 1 : 1;
    
    // Create the content with the new order
    const content = await prisma.content.create({
      data: {
        title,
        type,
        url,
        text,
        duration,
        order: newOrder,
        sectionId
      }
    });
    
    res.json({ message: "Content created successfully", content });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ error: "Failed to create content" });
  }
});

// Update content
adminRouter.put("/content/:contentId", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const contentId = parseInt(req.params.contentId);
  const { title, type, url, text, duration } = req.body;
  
  try {
    // Get the content with its section and course to verify ownership
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: { 
        section: {
          include: { course: true }
        }
      }
    });
    
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    
    if (content.section.course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to modify this content" });
    }
    
    // Update the content, but don't allow direct order update
    const updatedContent = await prisma.content.update({
      where: { id: contentId },
      data: {
        title: title !== undefined ? title : content.title,
        type: type !== undefined ? type : content.type,
        url: url !== undefined ? url : content.url,
        text: text !== undefined ? text : content.text,
        duration: duration !== undefined ? duration : content.duration
        // We'll ignore order updates here, use reorder endpoint instead
      }
    });
    
    res.json({ message: "Content updated successfully", content: updatedContent });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ error: "Failed to update content" });
  }
});

// Get all content items for a section
adminRouter.get("/section/:sectionId/contents", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const sectionId = parseInt(req.params.sectionId);
  
  try {
    // Get the section with its course to verify ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true }
    });
    
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    
    if (section.course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to access this content" });
    }
    
    // Get all content for the section
    const contents = await prisma.content.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' }
    });
    
    res.json({ message: "Content retrieved successfully", contents });
  } catch (error) {
    console.error("Error retrieving content:", error);
    res.status(500).json({ error: "Failed to retrieve content" });
  }
});

// Delete content
adminRouter.delete("/content/:contentId", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const contentId = parseInt(req.params.contentId);
  
  try {
    // Get the content with its section and course to verify ownership
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: { 
        section: {
          include: { course: true }
        }
      }
    });
    
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    
    if (content.section.course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to delete this content" });
    }
    
    // Delete the content
    await prisma.content.delete({
      where: { id: contentId }
    });
    
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ error: "Failed to delete content" });
  }
});

// Reorder sections within a course
adminRouter.put("/course/:courseId/reorder-sections", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const courseId = parseInt(req.params.courseId);
  const { sectionOrder } = req.body; // Array of section IDs in the desired order
  
  try {
    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    if (course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to modify this course" });
    }
    
    // Update order for each section
    const updates = sectionOrder.map((sectionId, index) => {
      return prisma.section.update({
        where: { id: sectionId },
        data: { order: index + 1 }
      });
    });
    
    await prisma.$transaction(updates);
    
    res.json({ message: "Sections reordered successfully" });
  } catch (error) {
    console.error("Error reordering sections:", error);
    res.status(500).json({ error: "Failed to reorder sections" });
  }
});

// Reorder content within a section
adminRouter.put("/section/:sectionId/reorder-contents", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const sectionId = parseInt(req.params.sectionId);
  const { contentOrder } = req.body; // Array of content IDs in the desired order
  
  try {
    // Get the section with its course to verify ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true }
    });
    
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    
    if (section.course.creatorId !== adminId) {
      return res.status(403).json({ message: "Not authorized to modify this section" });
    }
    
    // Update order for each content
    const updates = contentOrder.map((contentId, index) => {
      return prisma.content.update({
        where: { id: contentId },
        data: { order: index + 1 }
      });
    });
    
    await prisma.$transaction(updates);
    
    res.json({ message: "Content reordered successfully" });
  } catch (error) {
    console.error("Error reordering content:", error);
    res.status(500).json({ error: "Failed to reorder content" });
  }
});
// ADMIN DASHBOARD ROUTES

adminRouter.get("/dashboard", adminMiddleware, async (req, res) => {
  try {
    // Fetch overview counts
    const [totalCourses, totalSections, totalContents, totalUsers, totalPurchases] = await Promise.all([
      prisma.course.count(),
      prisma.section.count(),
      prisma.content.count(),
      prisma.user.count(),
      prisma.purchase.count(),
    ]);

    // Recent Courses
    const recentCourses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Top Courses by activity
    const allCourses = await prisma.course.findMany({
      include: {
        sections: {
          include: {
            contents: true,
          },
        },
      },
    });

    const topCourses = allCourses.map(course => {
      const sectionCount = course.sections.length;
      const contentCount = course.sections.reduce((acc, sec) => acc + sec.contents.length, 0);
      return {
        id: course.id,
        title: course.title,
        sectionCount,
        contentCount,
      };
    }).sort((a, b) => b.contentCount - a.contentCount).slice(0, 5);

    // Total Revenue
    const purchasesWithCourse = await prisma.purchase.findMany({
      include: {
        course: {
          select: { price: true },
        },
      },
    });

    const totalRevenue = purchasesWithCourse.reduce((sum, purchase) => {
      return sum + (purchase.course?.price || 0);
    }, 0);

    // All Courses with their purchase counts (including 0)
const allCoursesWithPurchases = await prisma.course.findMany({
  include: {
    purchases: true, // assumes Course has a relation: Course -> Purchase[]
  },
});

const popularCourses = allCoursesWithPurchases.map(course => ({
  id: course.id,
  title: course.title,
  purchaseCount: course.purchases.length,
}));

 


    // Final response
    res.json({
      overview: { totalCourses, totalSections, totalContents },
      recentCourses,
      topCourses,
      totalUsers,
      totalPurchases,
      totalRevenue,
      popularCourses,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});




module.exports = { adminRouter };