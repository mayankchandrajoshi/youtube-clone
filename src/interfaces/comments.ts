export interface commentInterface {
    comment:{
        id:string,
        text:string,
        likes:number,
        totalReplies:number,
        publishedAt:string,
        updatedAt:string,
    },
    author:{
        id:string,
        name:string,
        picture:string,
    },
}

export interface commentsInterface {
    comments:commentInterface[],
    nextPageToken?:string,
    isDisabled:boolean
}

export interface replyInterface {
    reply:{
        id:string,
        text:string,
        likes:number,
        publishedAt:string,
        updatedAt:string,
    },
    author:{
        id:string,
        name:string,
        picture:string,
    },
}

export interface repliesInterface {
    replies:replyInterface[],
    nextPageToken?:string,
}