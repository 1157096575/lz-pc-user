Mock.mock(/\/user\/delete-issue-concern/,'post',{"code":1,"msg":"成功"}); //取消关注
Mock.mock(/\/user\/save-issue-concern/,'post',{"code":1,"msg":"成功"}); //关注
Mock.mock(/\/user\/delete-issue-collect/,'post',{"code":1,"msg":"成功"}); //取消收藏
Mock.mock(/\/user\/save-issue-collect/,'post',{"code":1,"msg":"成功"}); //收藏
Mock.mock(/\/user\/delete-agree-info/,'post',{"code":1,"msg":"成功"}); //取消点赞
Mock.mock(/\/user\/save-agree-info/,'post',{"code":1,"msg":"成功"}); //点赞
Mock.mock(/\/user\/is-apply/,'get',{"code":1,"msg":"成功"}); //追问
Mock.mock(/\/user\/append-comment/,'post',{"code": 1, "msg": "成功"}); //继续追问
Mock.mock(/\/user\/save-issue/,'post',{"code":1,"msg":"成功"}); //提问

//全部问题（社区首页）
var getAllIssueList = [];
for (var i=0; i<3; i++) {
  getAllIssueList.push({"id":59,
    "createTime":"2017-09-29 16:01:29",
    "content":"@cparagraph(1, 20)",
    "isConcern":false,
    "comment":{
      "id":119,
      "userId":17767,
      "content":"@cparagraph(1, 20)",
      "createTime":"2017-12-07 11:02:38",
      "useCount":0,
      "agreeNum":0,
      "userName":"@cname()",
      "userLogo":"@image",
      "isCollect":false,
      "isAgree":false
    },
    "caseType":{
      "id":4,
      "name":"合同纠纷"
    },
    "userLogo":"@image",
    "userName":"哇啊",
    "url":"@url"
  });
}
Mock.mock(/\/user\/get-all-issue-list/,'get',{
  "code":1,
  "msg":"查询成功",
  "data":{
    "total":59,
    "items":getAllIssueList
  }
});

//问答分类
var getIssueListType = [];
for (var i=0; i<2; i++) {
  getIssueListType.push({"id":59,
    "createTime":"2017-09-29 16:01:29",
    "content":"@cparagraph(1, 20)",
    "isConcern":false,
    "comment":{
      "id":119,
      "userId":17767,
      "content":"@cparagraph(1, 20)",
      "createTime":"2017-12-07 11:02:38",
      "useCount":0,
      "agreeNum":0,
      "userName":"@cname()",
      "userLogo":"@image",
      "isCollect":false,"isAgree":false},
      "caseType":{
        "id":4,
        "name":"合同纠纷"
      },
    "userLogo":"@image",
    "userName":"哇啊",
    "url":"@url"
  });
}
Mock.mock(/\/user\/get-issue-list-type/,'get',{
  "code":1,
  "msg":"查询成功",
  "data":{
    "total":59,
    "items": getIssueListType
  }
});
//查询问题信息
var getIssueInfo = [];
for (var i=0; i<2; i++) {
  getIssueInfo.push({
    "id": 1,
    "userId": 1927,
    "content": "@cparagraph(1, 20)",
    "createTime": "2017-05-17 11:00:38",
    "state": false,
    "agreeNum": 1,
    "userName": "@cname()",
    "userLogo": "@image",
    "company": "@city(true)",
    "collectNum": 1,
    "isCollect": false,
    "isAgree": false
  });
}
Mock.mock(/\/user\/get-issue-info/,'get',{
  "code": 1,
  "msg": "查询成功！",
  "data": {
    "id": 1,
    "createTime": "2017-05-04 15:21:00",
    "readNum": 66,
    "content": "@cparagraph(1, 20)",
    "commentList": getIssueInfo,
    "commentNum": 1,
    "concernNum": 0,
    "caseType": {
      "id": 2,
      "name": "婚姻家庭"
    },
    "userLogo": "@image",
    "userName": "@cname()",
    "isMine": true
  }
});

var getMoreComment = [];
for (var i=0; i<2; i++) {
  getMoreComment.push({
    "id": 1,
    "userId": 1927,
    "content": "@cparagraph(1, 20)",
    "createTime": "2017-05-17 11:00:38",
    "state": false,
    "agreeNum": 0,
    "replyId": 0,
    "userName": "@cname()",
    "userLogo": "@image",
    "company": "@city(true)",
    "isCollect": true,
    "isAgree": false,
    "isMine" : true
  });
}

//更多回答
Mock.mock(/\/user\/get-more-comment/,'get',{
  "code": 1,
  "msg": "问题回答查询成功",
  "data": {
    "total": 19,
    "items": getMoreComment
  }
});
var getCommentId = [];
for(var i= 0; i<6; i++) {
  getCommentId.push({
    "id": 3,
    "userId": 1933,
    "content": "@cparagraph(1, 20)",
    "createTime": "2017-06-05 10:56:47",
    "state": false,
    "agreeNum": 0,
    "replyId": 1,
    "userName": "@cname()",
    "userLogo": "@image",
    "issueCommentList": [
      {
        "id": 7,
        "userId": 1925,
        "content": "@cparagraph(1, 20)",
        "createTime": "2017-06-05 11:18:22",
        "state": false,
        "agreeNum": 0,
        "replyId": 3,
        "userName": "@cname()",
        "userLogo": "@image"
      },
      {
        "id": 8,
        "userId": 1925,
        "content": "@cparagraph(1, 20)",
        "createTime": "2017-06-05 11:28:38",
        "state": false,
        "agreeNum": 0,
        "replyId": 3,
        "userName": "@cname()",
        "userLogo": "@image"
      }
    ]
  })
}
//刷新追问信息
Mock.mock(/\/user\/get-comment-id/,'get',{
  "code": 1,
  "msg": "追问信息查询成功",
  "data": getCommentId
});