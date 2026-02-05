// DTO = Data Transfer Object
// This defines what data we expect when creating an article
// Think of it as a "contract" for the incoming request

export class CreateArticleDto {
    title: string;        // Required: article title
    slug: string;        // Required: URL-friendly identifier
    content: string;     // Required: article content
    publishedAt?: Date;  // Optional: when to publish (the ? makes it optional)
  }