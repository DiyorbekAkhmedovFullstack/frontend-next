// Matches backend CommentAuthorDto
export interface CommentAuthor {
  userId: number; // Long in Java
  firstName: string;
  lastName: string;
}

// Matches backend CommentDto
export interface Comment {
  id: number; // Long in Java
  studienkollegId: string;
  author: CommentAuthor;
  title: string;
  content: string;
  createdAt: string; // Format: "dd.MM.yyyy HH:mm"
  likesCount: number; // Integer in Java
  isLikedByCurrentUser: boolean; // Boolean in Java
  isOwnComment: boolean; // Boolean in Java
}

export interface CreateCommentRequest {
  studienkollegId: string;
  title: string;
  content: string;
}

export interface UpdateCommentRequest {
  title: string;
  content: string;
}
