var today = new Date().toISOString().split("T")[0];
var maxYear = new Date().getFullYear() + 1;
var maxDate = maxYear + "-12-31";

document.getElementById("journeyDate").setAttribute("min", today);
document.getElementById("journeyDate").setAttribute("max", maxDate);

var yearInput = document.querySelector("#journeyDate");

document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("availabilityForm");
    var responseContainer = document.getElementById("responseContainer");
    var submitButton = document.getElementById("submitButton");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Disable the submit button
        submitButton.disabled = true;
        
        // Show loading symbol
        var loadingSymbol = document.createElement("span");
        loadingSymbol.classList.add("loading-symbol");
        submitButton.appendChild(loadingSymbol);

        var formData = new FormData(form);
        var requestData = {};
        for (var pair of formData.entries()) {
            requestData[pair[0]] = pair[1];
        }
        console.log(requestData);
        var requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        };

        fetch("/check_availability", requestOptions)
            .then(function (response) {
                return response.text();
            })
            .then(function (data) {
                data = JSON.parse(data);
                console.log(data);
                if (data.errorMessage) {
                    var avlDayListString = data.errorMessage;
                } else {
                    // Create a table to display the avlDayList
                    var avlDayList = data.avlDayList;
                    var tableHTML = "<table>";
                    tableHTML += "<tr><th>Date</th><th>Status</th></tr>";
                    avlDayList.forEach(function (avl) {
                        tableHTML += `<tr><td>${avl.availablityDate}</td><td>${avl.availablityStatus}</td></tr>`;
                    });
                    tableHTML += "</table>";

                    var avlDayListString = tableHTML;
                }
                // Display the avlDayList in the responseContainer
                responseContainer.innerHTML = avlDayListString;
                
                // Remove loading symbol
                submitButton.removeChild(loadingSymbol);
                
                // Enable the submit button
                submitButton.disabled = false;
            })
            .catch(function (error) {
                responseContainer.innerText = "An error occurred: " + error;
                
                // Remove loading symbol
                submitButton.removeChild(loadingSymbol);
                
                // Enable the submit button
                submitButton.disabled = false;
            });
    });
});
