/**
 * Function for opening a tab on click, in the test page.
 *
 * This is almost a direct copy of the W3 Schools tutorials on tabs and
 * full-page tabs:  https://www.w3schools.com/howto/howto_js_tabs.asp
 *
 * @param {??} event The tab button clicked?  It seems to be this, as the
 * className attribute of the button has " active" appended to it.
 * @param {String} id DOM node ID of the tab button target (tab content).
 * @return N/A, displays the tab content associated with the tab button
 * clicked.
 */
function openTab(event, id) {
  // Get tab buttons and tab content
  let tb = document.getElementsByClassName("tabButton");
  let tc = document.getElementsByClassName("tabContent");
  // Loop over the tab buttons and make inactive
  for (let i = 0; i < tb.length; ++i) {
    tb[i].className = tb[i].className.replace(" active", '');
  };
  // Loop over the tab content and make display none
  for (let i = 0; i < tc.length; ++i) {
    tc[i].style.display = "none";
  };
  // Display target of tab button
  document.getElementById(id).style.display = "block";
  // Make current tab button the active tab
  event.currentTarget.className += " active";
}
