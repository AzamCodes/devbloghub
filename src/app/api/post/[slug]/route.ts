export const PUT = async (req: NextRequest) => {
  try {
    const userId = await getDataFromToken(req);
    const currentSlug = req.nextUrl.pathname.split("/").pop();
    const post = await Post.findOne({ slug: currentSlug, userId });

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found." });
    }

    const formData = await req.formData();
    const newTitle = formData.get("title") as string;
    const newDesc = formData.get("desc") as string;
    const newSlug = formData.get("slug") as string;
    const newImg = formData.get("img");

    if (newSlug && newSlug !== post.slug) {
      // Check if the new slug already exists
      const existingPost = await Post.findOne({ slug: newSlug, userId });

      if (existingPost) {
        return NextResponse.json({
          success: false,
          message: "Slug already exists.",
        });
      }

      post.slug = newSlug;
    }

    const filter = new Filter();
    post.title = filter.clean(newTitle);
    post.desc = filter.clean(newDesc);

    if (newImg && newImg instanceof File) {
      const imageBuffer = Buffer.from(await newImg.arrayBuffer());
      const { width, height } = await sharp(imageBuffer).metadata();

      if (width === undefined || height === undefined) {
        throw new Error("Failed to retrieve image metadata");
      }

      if (width < 800 || height < 600) {
        throw new Error("Image dimensions should be at least 800x600 pixels.");
      }

      if (imageBuffer.length > 5 * 1024 * 1024) {
        throw new Error("Image size should not exceed 5MB.");
      }

      // Upload the image to Cloudinary
      const imageStream = new Readable();
      imageStream.push(imageBuffer);
      imageStream.push(null);

      const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "blog_posts", quality: "auto", fetch_format: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        imageStream.pipe(uploadStream);
      });

      post.img = cloudinaryResponse.secure_url;
    }

    await post.save();
    return NextResponse.json({
      success: true,
      message: "Post updated successfully.",
      userId,
    });
  } catch (error: unknown) {
    // Typecast error to Error
    const errorMessage = (error as Error).message || "An error occurred";
    console.error("Error updating post:", errorMessage);
    return NextResponse.json({ success: false, message: errorMessage });
  }
};
