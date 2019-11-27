# I. Introduction

This is a new repository I made for the Hokie PRIDE website source code, so we have a shared place for it. It uses a static site generator called <a href="https://www.11ty.io/docs/">eleventy</a> to spit out the website html from a bunch of templates and data files. I'll give a quick walkthrough of what all the files in here represent.

- **css**: For any website, the css code is what turns a buch of hyperlinks and times new roman headers into an actual website. It basically contains all of the formatting and stuff that makes the website look the way it does.
- **dist**: This is eleventy's output folder. Basically, if you just took this folder and uploaded it to the server, you'd have the real, functional website.
- **fonts**: I haven't looked in here but I assume it has the fonts that the css references.
- **images**: This is where we keep our custom images. Most of the stuff in here is the faces of team members and logos for constituent orgs, plus our own logo and a couple other things. If you want to put it on the website, put it here.
- **img**: As far as I can tell, this is where the utility images from the template come from. A bunch of loading icons and share buttons.
- **js**: The Javascript that runs in the background of the website goes here. I have no idea what any of it does.
- **mailchimp**: I think this was supposed to be for the mailchimp subscribe widget but that didn't end up working, at least not yet.
- **node-modules**: This stores a bunch of weird stuff that eleventy does that I don't want to mess with. Also plugins?
- **src**: Here's the most important folder! This is all the source code, i.e. everything you actually edit to change the website. It contains a few subfolders that are important to talk about.
  - **data**: Includes all of the .js files that supply info about variables to eleventy. Each file is essential an array of objects/structs/whatever you wanna call them that each contain a set of information about a thing. For example, the team.js file contains info on the name, pronouns, bio, strengths, duties, and fun facts of each team member, and those values are represented by variables in the actual .html files so that team member info can be updated in the .js file and the updates can be propogated throughout the site.
  - **includes**: Has two folders, components and layouts. Components include the header and footer templates, which are then included within the main default layout under *layouts*. These define the basic structure of every page on the site, meaning that as long as you add a front-matter variable `layout: layouts/default` to the other source code files you can automatically plug them into the normal page format.  Speaking of which:
  
# II. What the Hell am I Talking About?

This is a lot to take in, so let me try to explain. Basically, what I've done here is have a data folder with some big lists of all of the stuff we generally change on the site, an includes folder with the main templates that the source code uses, and a bunch of source code html files that contain the actual information about what the content of each page should be. At the start of each of these source code files, you should see something like this:
```
---
title: "Home"
layout: "layouts/default"
---
```
These are what's called **front-matter variables**. They're just arbitrarily defined variables that a template using this source code can use. These variables are referenced with two curly braces, {{like this}}. For example, the default template reads `<title>{{title}} - Hokie PRIDE of Virigina Tech</title>` so that the title for the home page will read "Home - Hokie PRIDE at Virginia Tech" while the title for the about page will replace "Home" with "About". There's some extra conditional stuff in the default layout but don't worry too much about that, it's a whole thing with using a variable name as a title in a source code file that I had to hack together.

More stuff can go in the front matter than just variables, though. For an example, let's check out the front matter on member.html:
```
---
layout: layouts/default
pagination:
  data: "team"
  size: 1
  alias: "member"
permalink: "team/{{ member.id }}/index.html"
renderData:
  title: "{{ member.name }}"
---
```
Two more key things are happening here: pagination and permalink. What are these? Well, you may have noticed there's only one member.html file, and not a whole list of them for each position. That's because the pagination command tells eleventy to generate as many pages as there are team members in the team.js file. Think of it like a for loop, where the value going into *data* is the array and the value in *alias* is the index. Each member has an id, a name, pronouns, and so on, and these fields can be accessed in this file using the alias "member", i.e. {{member.id}}, {{member.name}}, etc. This html file is a generic team member page, with the path to the image, position, duties, bio, pronouns, name, strengths, and fun facts all replaced with these kinds of variables. Pagination uses this template to generate as many member pages as there are entries in team.js. The size command tells it how many entries to process at a time, and for this kind of data should be 1.

This kind of structure can also be done on a smaller scale to generate content on pages like the team page. Let's check out this segment in team.html:
```
{% for member in team %}
<div class="col-sm-6 col-md-4">
  <article class="vertical-item content-padding big-padding with_border bottom_color_border loop-color text-center">
    <div class="item-media"> <img src="{{ member.image }}" alt=""> </div>
    <div class="item-content">
      <header class="entry-header">
        <h3 class="entry-title small bottommargin_0"> <a href="/team/{{member.id}}">{{member.name}}</a> </h3> <span class="small-text highlight">{{member.position}}</span> <span class="small-text highlight">{{member.pronouns}}</span> </header>
    </div>
  </article>
</div>
{% endfor %}
```
This bit isn't just *like* a for loop, it's ... literally a for loop. Literally in Javascript, even. Putting code in brackets {% like these %} tells eleventy to execute that bit like Javascript, so it looks at this code and writes out the block inside the for loop for each member in team.js. The same principles from above apply, variables are referenced in the same way.

So we understand pagination, a bit, but what's this permalink thing? Well, it's what it sounds like. It tells eleventy where to put the link to the page. See, we used to use a bunch of html files all in one directory so you'd just reference them directly as "about.html" or whatever, but that's not usually how websites do it. The way I've organized now, each final page in /dist/ is an index.html file in a directory with its name. This lets us list pages like `hokiepride.org.vt.edu/team` instead of `/team.html`, which is nice. So you can see in the front matter I listed above that I set each team member page to be located at `/team/[id number]/`, which makes them easier to track.

These are more or less the basics of how I ported the website over to eleventy. You can try to go through the source code now and see if you understand what I'm getting at, and if not I'd be happy to try and elaborate if you ask me anything. The eleventy documentation is there too, that can be a pretty big help.
