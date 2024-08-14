export interface thumbnailInterface {
    channel : {
      id: string,
      name: string,
      thumbnail?: string,
    },
    video : {
      id : string,
      publishedAt: string,
      thumbnail : string,
      description:string,
      title : string,
      viewCount:string,
      duration:string
    }
}

export interface videoInterface {
  videos : thumbnailInterface[],
  nextPageToken ?: string
}

export interface videoDetailsInterface {
  id: string,
  video: {
    publishedAt: string,
    title: string,
    description: string,
    thumbnail: string,
    tags: string[],
    categoryId: string
  },
  statistics: {
    viewCount: string,
    likeCount: string,
    commentCount: string
  },
  channel : {
    channelId:string,
    channelAvatar:string,
    channelTitle :string,
    subscribers : string
  }
}