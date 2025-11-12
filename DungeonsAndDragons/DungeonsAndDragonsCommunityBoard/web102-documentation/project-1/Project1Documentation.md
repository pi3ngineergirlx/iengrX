# Web Development Project 1 - *Sci-Fi Dungeons and Dragons*

Submitted by: **Soma Hebbar**

This web app: **is a website for a science fiction based version of Dungeons and Dragons, the
popular tabletop role-playing game. It outlines possibilities for storylines emerging from research and theories on futurism, technology, and biological engineering. The cosplay section introduces users to dressing and acting as their D&D characters, and also to the STEM skills associated with cosplaying as their favorite characters from movies, books, and TV shows.**

Time spent: **5** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The app has a cohesive, unique theme for events or resources relevant to a specific community**
- [x] Header/title describing the theme is displayed
- [x] **At least 10 unique events or resources are displayed in a responsive card format**
- [x] There are at least 10 cards displayed 
- [x] The cards should be displayed in an organized format (ex. a grid, or in one line)
- [x] Each card should include some information about the event or resource


The following **optional** features are implemented:

- [ ] Buttons or links to a related resources are on each card component
  - [ ] All cards have buttons or links in addition to text
- [ ] The site is responsive for both desktop and mobile formats
  - [ ] Web app is shown in a mobile format
  - [ ] **Video Walkthrough Special Instructions**: To ease the grading process, please use Chrome Developer Tools' "Toggle Device" button to demonstrate that your web application's responsiveness in both a desktop *and* a mobile format. Detailed instructions can be found below this stretch feature on the project page. 

The following **additional** features are implemented:

* [ ] List anything else that you added to improve the site's functionality!

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='D&DWEB102Project1Video.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with Kap 
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

There was initially extra white space on the left and right sides of the website. This issue
was fixed through the removal of max-width in the #root section of App.css. An issue with only the middle half of the computer screen displaying the webpage was also present because of the flex-direction for all items being set to column. This issue was fixed by rearranging divs and classes so that the flex-direction for the items within the section containers was set to column but with the flex-direction for the card containers being set to row.

## License

    Copyright [2025] [Soma Hebbar]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.