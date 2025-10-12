export interface CommentAuthor {
  userId: number;
  firstName: string;
  lastName: string;
}

export interface Comment {
  id: number;
  studienkollegId: string;
  author: CommentAuthor;
  title: string;
  content: string;
  createdAt: string; // Format: "dd.MM.yyyy HH:mm"
  likesCount: number;
  isLikedByCurrentUser: boolean;
  isOwnComment: boolean;
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
