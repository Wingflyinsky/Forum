package com.feitian.forum.controller;

import com.feitian.forum.domain.Topic;
import com.feitian.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/topic")
public class TopicController {

    @Autowired
    UserService userService;

    @RequestMapping("/{topicId}")
    String readTopic(@PathVariable String topicId){
        return "topic/topic";
    }

    @RequestMapping("/selectTopicById")
    @ResponseBody
    Object getTopicById(long topicId){
        Topic topic = userService.getTopicById(topicId);
        return topic;
    }
}
