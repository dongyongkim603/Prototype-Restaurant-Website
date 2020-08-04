// Online ordering takeout form validation - disables form submissions if there are invalid fields
(function () {
    window.addEventListener('load', function () {
        var forms = document.getElementsByClassName('needs-validation');
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                else {
                    $("#dialog-message").dialog("open");

                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);

            form.addEventListener('reset', function (event) {
                form.classList.remove('was-validated');
            }, false);
        });
    }, false);

    $(":submit").prop("disabled", true);

    $("#smartcart").on("cartSubmitted", function(e) {
        $("#accordion").accordion({ active: 2 });
        $(":submit").prop("disabled", false);
    });

    $("#dialog-message").dialog({
        autoOpen: false,
        buttons: {
            Ok: function() {
                $(this).dialog("close");
                window.location = "Home Page.html";
            }
        },
        dialogClass: "dialogMsgClass"
    });
})();

function populateDateTimeTab() {
    var dayNames = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    };

    var monthNames = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    };

// Sunday starts with 0
    var timeRanges = {
        0: {start: "11:30", end: "22:00"},
        1: {start: "11:30", end: "22:00"},
        2: {start: "11:30", end: "22:00"},
        3: {start: "11:30", end: "22:00"},
        4: {start: "11:30", end: "22:00"},
        5: {start: "11:30", end: "23:00"},
        6: {start: "11:30", end: "23:00"}
    };

    var today = new Date();
    var day = today.getDay();

    timeRanges[day]["start"] = updateTodayStartTime(today);

    var dates = [];

    for (var i = 0; i < 7; i++) {
        var newDate = new Date();
        newDate.setDate(today.getDate() + i);
        dates.push(dayNames[newDate.getDay()] + ", " + monthNames[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear());
    }

    var dateSelect = $('#order-date');

    $.each(dates, function (val, text) {
        dateSelect.append(
            $('<option></option>').val(val).html(text)
        );
    });

    var timeSelect = $('#order-time');

    populateTimeDropdown(timeRanges, today.getDay(), timeSelect);

    // Change values in time dropdown based on day that is selected
    dateSelect.change(function () {
        timeSelect.empty();

        var day = new Date($('#order-date option:selected').text()).getDay();

        populateTimeDropdown(timeRanges, day, timeSelect);
    });
}

function updateTodayStartTime(today) {
    var todayStartHour = today.getHours();
    var todayStartMinute = today.getMinutes();
    var quarterHours = Math.ceil(todayStartMinute/15);

    if (quarterHours === 4) {
        todayStartHour++;
    }

    todayStartMinute = (quarterHours * 15) % 60;

    if (todayStartMinute === 0) {
        todayStartMinute = "00";
    }

    return todayStartHour + ":" + todayStartMinute;
}

function populateTimeDropdown(timeRanges, day, timeSelect) {
    var timeRange = timeRanges[day];
    var startTime = timeRange["start"];
    var startArr = startTime.split(":");
    var startHour = Number(startArr[0]);
    var startMinute = Number(startArr[1]);
    var endTime = timeRange["end"];
    var endArr = endTime.split(":");
    var endHour = Number(endArr[0]);
    var endMinute = Number(endArr[1]);
    var timeSuffix = " AM";

    for (var hour = startHour; hour <= endHour; hour++) {
        if (hour > 11) {
            timeSuffix = " PM";
        }

        for (var minute = 0; minute <= 45; minute += 15) {
            if (hour === startHour && minute < startMinute) {
                continue;
            } else if (hour === endHour && endMinute < minute) {
                break;
            }

            var time = (hour === 12 ? 12 : hour % 12).toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0") + timeSuffix;

            timeSelect.append(
                $('<option></option>').val(time).html(time)
            );
        }
    }
}

function addTakeoutItem(inventory) {
    var source = document.getElementById("item-template").innerHTML;
    var template = Handlebars.compile(source);

    if (inventory.values.length > 0) {
        for (i = 0; i < inventory.values.length; i++) {
            var row = inventory.values[i];
            var context = { itemName: row[0], itemDescription: row[1], itemPrice: row[2], itemValue: i + 1 };
            var html = template(context);

            $("#itemsHeader").append(html);
        }
    }
}
