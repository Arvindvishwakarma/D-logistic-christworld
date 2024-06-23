import { gql } from '@apollo/client';


export const MUTATION_CREATE_USER = gql`
mutation Mutation($userInput: userInput) {
  createUser(UserInput: $userInput) {
    id
   
  }
}
`

export const MUTATION_USER_LOGIN =gql`
mutation UserLogin($email: String!, $password: String!) {
  userLogin(email: $email, password: $password) {
    userId
    userToken
    userTokenExpiration
  }
}

`

export const MUTATION_SEND_REQUEST =gql`
mutation Mutation($sendRequestFriendInput: sendRequestFriendInput) {
  sendRequestUser(SendRequestFriendInput: $sendRequestFriendInput) {
    id
   
  }
}

`

export const MUTATION_CREATE_POST_USER = gql`
mutation Mutation($postInput: postInput) {
  createPost(PostInput: $postInput) {
    id
   
  }
}
`

export const MUTATION_CREATE_LIKE_POST =gql`
mutation Mutation($userLikePostInput: userLikePostInput) {
  createLikePost(UserLikePostInput: $userLikePostInput) {
    id
   
  }
}
`
export const MUTATION_CREATE_DISLIKE_POST =gql`
mutation DisLikePost($postId: ID, $likeId: ID) {
  disLikePost(PostId: $postId, likeId: $likeId) {
    id
    
  }
}

`;

export const MUTATION_COMMET_USER = gql`
mutation Mutation($userPostCommentInput: userPostCommentInput) {
  createCommentPost(UserPostCommentInput: $userPostCommentInput) {
    id
    
  }
}


`

export const MUTATION_CANCEL_REQUEST_USER = gql`
mutation Mutation($userId: ID, $friendId: ID) {
  cancelRequestUser(userId: $userId, friendId: $friendId) {
    id
   
  }
}
`
export const MUTATION_CONFIRM_REQUEST_USER = gql`
mutation ConfirmSendRequestUser($sendRequestFriendInput: sendRequestFriendInput) {
  confirmRequestUser(SendRequestFriendInput: $sendRequestFriendInput) {
    id
   
  }
}
`

export const MUTATION_CONFIRM_REQUEST_USER_ACTIVE = gql`
mutation Mutation($userId: ID, $friendId: ID, $status: String) {
  confirmSendRequestUser(userId: $userId, friendId: $friendId, status: $status) {
    id
   
  }
}
`

export const MUTATION_UPDATE_USER_PROFILE = gql`
mutation EditUserProfile($userEditProfileInput: userEditProfileInput) {
  editUserProfile(UserEditProfileInput: $userEditProfileInput) {
    id
  
  }
}

`

export const MUTATION_CREATE_CONVERSATION = gql`
mutation Mutation($conversationInput: conversationInput) {
  createConversation(ConversationInput: $conversationInput) {
    id
   
  }
}

`

export const mUTATION_UPDATE_POST = gql`
mutation Mutation($postUpdateInput: postUpdateInput) {
  updatePost(PostUpdateInput: $postUpdateInput) {
    id
   
  }
}

`

export const MUTATION_DELETE_POST = gql`
mutation DeletePost($postId: ID) {
  deletePost(postId: $postId) {
    id
   
}
}
`

export const MUTATION_CREATE_STATUS = gql`
mutation Mutation($statusInput: statusInput) {
  createStatus(StatusInput: $statusInput) {
    id
  
  }
}
`

export const MUTATION_CHAT_UPDATE = gql`
mutation Mutation($conversationUpdateInput: conversationUpdateInput) {
  conversationUpdate(ConversationUpdateInput: $conversationUpdateInput) {
    id
    userId
   
   
  }
}

`

export const MUTATION_ADD_MORE_STATUS = gql`
mutation Mutation($addMoreStatusInput: addMoreStatusInput) {
  addMoreStatus(AddMoreStatusInput: $addMoreStatusInput) {
    id
 
  }
}

`

export const MUTATION_UPDATE_CHAT_BY_ID = gql`
mutation Mutation($updateChatInput: updateChatInput) {
  updateChatById(UpdateChatInput: $updateChatInput) {
    id
   
    
  }
}

`

export const MUTATION_CREATE_CHAT = gql`
mutation Mutation($chatInput: chatInput) {
  createChat(ChatInput: $chatInput) {
    id
   
  }
}
`

export const MUTATION_DELETE_CHAT = gql`
mutation Mutation($chatId: ID, $currentChatId: ID) {
  deleteChat(chatId: $chatId, currentChatId: $currentChatId) {
    id
   
  }
}
`

export const MUTATION_USER_UPDATE = gql`
mutation Mutation($userUpdateInput: userUpdateInput) {
  updateUser(UserUpdateInput: $userUpdateInput) {
    id
  }
}
`

export const MUTATION_NOTIFICATION =gql`
mutation Mutation($deviceToken: String, $title: String, $body: String) {
  pushNotificationToAssignNewDbOrder(deviceToken: $deviceToken, title: $title, body: $body)
}
`

export const MUTATION_CREATE_NOTIFICATION = gql`
mutation Mutation($notificationSendInput: notificationInputSend) {
  createNotifaction(NotificationSendInput: $notificationSendInput) {
    id
   
  }
}
`

export const MUTATION_DELETE_NOTIFITION = gql`
mutation Mutation($notificationId: ID) {
  deleteNotification(notificationId: $notificationId) {
    id
   
  }
}
`

export const MUTATION_UPDATE_NOTIFICATION = gql`
mutation Mutation($updateNotificationInput: updateNotificationInput) {
  updateNotificationSend(UpdateNotificationInput: $updateNotificationInput) {
    id

  }
}
`
export const MUTATION_RESET_PASSWORD = gql`
mutation ResetPassword($resetPasswordInput: resetPasswordInput) {
  resetPassword(ResetPasswordInput: $resetPasswordInput) {
    id
  
  }
}
`
export const MUTATION_STORY_DELETE = gql`
mutation Mutation($storyId: ID, $currentStroyId: ID) {
  deleteStory(storyId: $storyId, currentStroyId: $currentStroyId) {
    id
 
  }
}
`