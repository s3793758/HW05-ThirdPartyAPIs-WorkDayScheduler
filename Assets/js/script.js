const startTheDay = 1; // start at 1 am
const finishTheDay = 24; // finish at 12 am

setInterval(() => {
  $("#currentDayNow").text(moment().format("dddd, MMMM Do"));
}, 86400000); // update timer every day

init();

function init() {
  // get container
  let DayPlanner = $(".container");
  let textarea, BootstrapSaveImg, button;

  // append timeblocks
  for (var i = startTheDay; i <= finishTheDay; i++) {
    article = $("<article>");
    article.attr("id", `hour${i}`);
    article.addClass(
      "row d-flex justify-content-center align-content-stretch col-12 "
    );

    section = $("<section>");
    section.addClass("hour p3 col-2");
    section.text(moment(i, "H").format("h A"));
    article.append(section);

    textarea = $("<textarea>");
    textarea.addClass("col-8");
    if (i < moment().hour()) {
      textarea.addClass("past");
    } else if (i == moment().hour()) {
      textarea.addClass("present");
    } else {
      textarea.addClass("future");
    }
    article.append(textarea);

    button = $("<button>");
    button.addClass(
      "saveBtn d-flex justify-content-center align-items-center p-3 col-2"
    );
    addSaveListener(button);
    BootstrapSaveImg = $("<i>");
    BootstrapSaveImg.addClass("fa-solid fa-floppy-disk");
    button.append(BootstrapSaveImg);
    article.append(button);
    DayPlanner.append(article);
  }
  renderHours();
}

function addSaveListener(element) {
  element.on("click", saveToLocalStorage);
}

function saveToLocalStorage() {
  //* get local storage object called 'workDaySchedule'
  var workDaySchedule = [];
  workDaySchedule = localStorage.getItem("workDaySchedule");

  var id = $(this).parents("article").attr("id");
  var text = $(this).parents("article").children().eq(1).val();

  workDaySchedule === null
    ? (workDaySchedule = [])
    : (workDaySchedule = JSON.parse(workDaySchedule));

  workDaySchedule = workDaySchedule.filter((hour) => hour.hour != id);

  workDaySchedule.push({ hour: id, text: text });

  workDaySchedule = workDaySchedule.filter((text) => text.text.length != 0);

  localStorage.setItem("workDaySchedule", JSON.stringify(workDaySchedule));

  var message = $("<p>");
  message.addClass("col-12");
  message.text(
    `${$(this)
      .parents("article")
      .children()
      .eq(0)
      .text()} was saved to local storage`
  );
  $(".container").before(message);
  setTimeout(() => {
    message.remove();
  }, 1000);

  renderHours();
}

function renderHours() {
  var workDaySchedule = localStorage.getItem("workDaySchedule");
  workDaySchedule = JSON.parse(workDaySchedule);

  if (workDaySchedule != null) {
    workDaySchedule.forEach((hour) => {
      var article = $(`#${hour.hour}`);
      article.children().eq(1).text(`${hour.text}`);
    });
  }
}
