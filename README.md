# I. Introduction

This is a new repository I made for the Hokie PRIDE website source code, so we have a shared place for it. It uses a static site generator called <a href="https://www.11ty.io/docs/">eleventy</a> to spit out the website html from a bunch of templates and data files. I'll give a quick walkthrough of what all the files in here represent.

- **css**: For any website, the css code is what turns a buch of hyperlinks and times new roman headers into an actual website. It basically contains all of the formatting and stuff that makes the website look the way it does.
- **dist**: This is eleventy's output folder. Basically, if you just took this folder and uploaded it to the server, you'd have the real, functional website.
- **documents**: Our bylaws and constitution are in here, because they're accessible on the website.
- **fonts**: I haven't looked in here but I assume it has the fonts that the css references.
- **images**: This is where we keep our custom images. Most of the stuff in here is the faces of team members and logos for constituent orgs, plus our own logo and a couple other things. If you want to put it on the website, put it here.
- **img**: As far as I can tell, this is where the utility images from the template come from. A bunch of loading icons and share buttons.
- **js**: The Javascript that runs in the background of the website goes here. I have no idea what any of it does.
- **mailchimp**: I think this was supposed to be for the mailchimp subscribe widget but that didn't end up working, at least not yet.
- **node-modules**: This stores a bunch of weird stuff that eleventy does that I don't want to mess with. Also plugins?
- **old_versions**: I put old versions of the website here. I might try and have them avaliable on the website itself.
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

# III. Ok, so how do I edit this thing?

The nice bit is that I've already done a lot of the work for you. If you just need to do something simple like add, remove, or move team member or orgs, you just have to edit the files in the data folder. Let's go over the structure of my data:
```
{
    "id": "webtech",
    "name": "Lexi Flad",
    "pronouns": "She/They",
    "position": "Web & Technology Chair",
    "image": "/images/faces/Lexi.jpg",
    "bio": "I'm a Mechanical Engineering major from right here in Blacksburg, and I'm really excited to make things as nice as possible for you all going forward. I like writing, music, and games, and I can talk your ear off about anything.   ",
    "duties": [
                "Update the email listserv weekly with any sign-ups or removals;",
                "Maintain and regularly update the organization's website:",
                "Update permissions and rosters of Engagement Committee members on our Facebook page, Facebook Group, Engagement Committee listserv, HokiePRIDE listserv, and Google Drive as needed when Engagement Committee members leave or are elected;",
                "Keep records of the contact information for all Engagement Committee members and advisors;",
                "Act as a system administrator for the office computer;",
                "Keep record of all programs on the office computer;",
                "Install or remove software on the office computer as needed by the Engagement Committee;",
                "Work with the Resource Manager to help maintain the Google Drive; and",
                "Co-manage the GobblerConnect site with the President."
               ],
    "strengths": ["Adaptability",
                  "Connectedness",
                  "Relator",
                  "Harmony",
                  "Input"],
    "funfacts": [
                  "Most of my friends live halfway across the world!",
                  "...",
                  "",
                  "",
                  ",,,graphic design",
                ],
  },
```
This is all my data, written exactly as listed in the team.js folder as I'm writing this. I think most of these are pretty self-explanatory, but let's go through all these fields anyway. The *id* field is what will pop up in the url bar when someone visits this team member's page. I've set them all to simplified versions of each team member's position. ***Make sure you never put anything in this field a url can't handle.*** This includes ampersands, question marks, slashes, and so on, and things like spaces should generally be avoided. Generally try to make this field as simplistic as possible while still being descriptive.

The name, pronouns, and position will show up on the team member's card and on their page, and the page will contain the bio, duties, strengths, position duties, and fun facts. The image path will show in various places as well, but you'll need to put that slash at the beginning of the path to let eleventy know to look in the root directory rather than the directory that the current html file is in. Interns have much the same structure as team members, just without the details needed for individualized pages. If you look in interns.js you'll see it's very slimmed down compared to this.

Now let's take a look at the data structure for partners and resources. We'll use Q\*mmunity as an example.
```
{
    "slugName": "Qmmunity",
    "image": "/images/partners/qmmunity.png",
    "shortName": "Q*mmunity",
    "longName": "Q*mmunity Support Group",
    "shortBio": "Welcomes LGBTQ+ folks and those exploring their gender and sexuality to connect and share experiences. ",
    "longBio":  `
                  <p>This group welcomes folks who identify as LGBTQ+, as well as those who are exploring their gender and/or sexual identity, to connect and share their experiences. Feel free to come late, leave early, and/or bring food. Food is provided the first Monday of every month!</p>
                  <p>For fall 2018, the group will start on August 27th and will meet Mondays from 5:30-7:00 pm in the LGBTQ+ Resource Center (Squires 227).</p>
                  <p>For questions or more information, contact the group facilitator, Jordan Harrison, at <a href="mailto:harrisoj@vt.edu">harrisoj@vt.edu</a>!</h4>
                `
 },
```
So a lot of this is somewhat similar, but there's some new stuff to cover. the distinction between *shortName* and *longName* is simply there so that one name can be used for the partner card while another is used for the title on the partner's page. *shortBio* and *longBio* are distinguished for similar reasons. The *longBio* field is a bit different, though. As you can see, it's marked up like a normal html file, with paragraph markers and href links. This gives you more flexibility with editing these bios and making them look nice. The tick marks on either side of this field indicate that this is a **template literal**, or a block of html that is going to be inserted literally into the location you place it in the source code. The ability to use these is why these data files are .js and not .json. 

But there's maybe something a little more interesting here. What's *slugName*?. Well, remember that whole thing I said earlier about unsafe url characters? While asterisks aren't normally awful for urls, some component of this whole process really hates them. **Sluggification** is, surprisingly enough, not actually a genre of deviantart tf stories (or at least not exclusively), but the process of removing all the bad characters that the url doesn't like. Normally, writing a referenced variable as {{variable | slug}}, is enough to put it through a sluggification filter, but for whatever reason that doesn't help with something like Q\*mmunity. I didn't want to create a separate field for every single partner, though, so the *slugName* field only exists on partners that need one. The pagination for the partner pages creates permalinks like this:
```
permalink: "/pr/{% if org.slugName %}{{org.slugName}}{% else %}{{org.shortName | slug}}{% endif %}/index.html"
```
so the program will use *slugName* if one is given and will simply sluggify *shortName* if not. It's maybe not the most standard method, but it works.

If you want to add or remove stuff from this to bring the website in line with your own plans, that's fine, but you need to make sure you keep each field comma-separated like they are here and use arrays like the one under *duties* appropriately. By comma-separated, of course, I'm referring to that little comma after each field and after the ending curly brace. This is easy to forget, so always check. These curly braces denote that everything inside is effectively a struct, to put this in C terms, whereas the brackets indicate the contents are an array; both of these structures use comma separation to distinguish components. After this is assembled, the data inside can be accessed in the usual manner for something like this, with {{alias.field}}, as seen above.

# IV. Final Words

So, I've managed to figure this all out with a lot of help from my furry hacker gf (not to be confused with my hot flannel gf, my chill music gf, or my anime blob gf). But here's my secret: I know very little about how to actually code. I have the brain for it, but my entire actual experience consists of like a semester of C++, a piece of a semester where we did enough assembly to program a basic computer fan, and that time I did a bunch of coding for that custom VVVVVV level. I still can't *quite* wrap my head around how exactly html works, but the fun thing about that is that I don't really have to! See, our website is entirely based on a template, which should be avaliable to you in the team google drive. It's a generic thing that the old president bought for use in hastily constructing the website we have now. He had no idea what he was doing either.

My point is that all we've done to create what we have now is just copy/paste a bunch of pieces from the template and attempt to scrub in our own information. All I did initially was change little things about the code and see what worked. So even if you don't know what you're doing, rest assured you're in good company. I've made treading water as easy as possible so feel free to do your best to continue what I started. Just make sure you're not editing the actual files that are visible online until you're positive you have things right. Work on the project locally and push the results with the github desktop app, and you should be fine. Github even has version control, so you can't mess anything up too badly.

Before I go though, I'll go ahead and give you a nice little tip for how you can have an easy preview of the website! To do this, you'll need to install node.js, which you can find <a href="https://nodejs.org/en/">here</a>. Once that's done, you need to open Powershell in the directory you're editing the website in. The easiest way to do this is to navigate to that folder in File Explorer and then type "powershell" in the address bar. Once you have node.js installed, you can type `npm start` in the powershell window. As long as your code doesn't have any errors, eleventy will write the proper website to *dist* and start sending a preview. If you type `localhost:8080` in the url bar of any web browser on this computer, you should be able to view this preview. And typically, the preview will even update automatically if you make any changes.

And with that, I wish you the best of luck in whatever you choose to do with my foundation. Be free and wild, like a young gay in the wind.
