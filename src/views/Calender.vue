<template>
  <div
    style="
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 20px;
    "
  >
    <!-- Dropdown to select between Sportma and Manager -->
    <div class="user-selection">
      <label for="user">Select User:</label>
      <select v-model="selectedUser">
        <option value="sportma">Sportma</option>
        <option value="manager">Manager</option>
      </select>
    </div>

    <!-- Radio buttons for selecting sport -->
    <div class="sport-selection">
      <label>
        <input
          type="radio"
          v-model="selectedSport"
          value="football"
          @change="updateSplitDays"
        />
        Football
      </label>
      <label>
        <input
          type="radio"
          v-model="selectedSport"
          value="padel"
          @change="updateSplitDays"
        />
        Padel
      </label>
      <label>
        <input
          type="radio"
          v-model="selectedSport"
          value="tennis"
          @change="updateSplitDays"
        />
        Tennis
      </label>
    </div>

    <!-- VueCal Calendar -->
    <vue-cal
      ref="vuecal2"
      locale="fr"
      class="vuecal--green-theme"
      style="height: 400px; width: 100%"
      hide-view-selector
      active-view="day"
      :time-step="30"
      :disable-views="['years', 'year', 'week']"
      :drag-to-create-event="false"
      show-time-in-cells
      :snap-to-time="15"
      editable-events
      :events="events"
      :split-days="splitDays"
      :min-cell-width="minCellWidth"
      @cell-click="createEventInSplit"
      @ready="scrollToCurrentTime"
      sticky-split-labels
      :on-event-dblclick="onEventClick"
      :overlaps-per-time-step="overlapsPerTimeStep"
      :min-event-width="minEventWidth"
      @event-create="onEventCreate"
      @event-drop="dropEvent"
    >
      <template #split-label="{ split, view }">
        <strong :style="`color: ${split.color}`">{{ split.label }}</strong>
      </template>
    </vue-cal>
  </div>

  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <!-- Title -->
      <v-card-title class="headline">Changer Le Statut</v-card-title>

      <!-- Status Selection -->
      <v-card-text>
        <div class="event-content">
          <select
            v-model="selectedStatus"
            @input="handleInput"
            style="
              width: 100%;
              height: 50px;
              padding: 10px;
              border: 2px solid #007bff;
              border-radius: 4px;
              outline: none;
            "
          >
            <option disabled value="disabled">Sélectionner le statut</option>
            <option value="green" data-class="green-event">🟢 Payé</option>
            <option value="yellow" data-class="yellow-event">
              🟡 en-cours
            </option>
            <option value="red" data-class="red-event">🔴 Annulé</option>
          </select>
        </div>

        <!-- Remarks Text Area for event.notes -->
        <v-textarea
          label="Remarques"
          v-model="this.selectedEvent.notes"
          rows="3"
          outlined
          style="margin-top: 20px"
        ></v-textarea>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="deleteEvent">Supprimer</v-btn>
        <!-- Delete Button -->
        <v-btn color="blue darken-1" text @click="confirm">Confirmer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import VueCal from "vue-cal";
import moment from "moment";
import { extendMoment } from "moment-range";

import "vue-cal/dist/vuecal.css";

const momentRange = extendMoment(moment);

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      timeCellHeight: 80, // Height of one hour in pixels
      now: new Date(), // Get the current time
      selectedUser: "manager", // Default selected user
      selectedSport: "football", // Default selected sport
      events: [],
      stickySplitLabels: true,
      minCellWidth: 400,
      minSplitWidth: 300,
      minEventWidth: 100,
      splitDays: [], // To be updated based on selected sport
      overlapsPerTimeStep: true,
      dialog: false,
      selectedEvent: null,
      selectedStatus: "disabled",
    };
  },
  mounted() {
    this.updateSplitDays(); // Initialize splitDays on mount
  },
  methods: {
    logEvents(event, data) {
      console.log(event, data);
    },
    checkForCreationOverlapping(newEvent) {
      const newEventStart = moment(newEvent.date);
      const newEventEnd = moment(newEvent.date).add(1, "hour"); // assuming duration is 1 hour, adjust this as needed

      const newEventRange = momentRange.range(newEventStart, newEventEnd);

      const isOverlap = this.events.some((event) => {
        // Check if the event is in the same split
        if (event.split === newEvent.split) {
          const existingEventStart = moment(event.start);
          const existingEventEnd = moment(event.end);
          const existingEventRange = momentRange.range(
            existingEventStart,
            existingEventEnd
          );

          // Check if the new event overlaps with any existing event
          return newEventRange.overlaps(existingEventRange);
        }
        return false; // No overlap if in different splits
      });

      return isOverlap;
    },
    isOverlapping(newEvent) {
      return this.events.some((event) => {
        // Exclude the newEvent itself by comparing IDs (or other unique properties)
        if (event.id === newEvent.event.id) {
          return false; // Skip the current newEvent in the comparison
        }

        // Create a range for the existing event
        const existingEventRange = momentRange.range(
          moment(event.start),
          moment(event.end)
        );

        // Create a range for the new event
        const newEventRange = momentRange.range(
          moment(newEvent.event.start),
          moment(newEvent.event.end)
        );

        if (event.split === newEvent.event.split) {
          // Check if the ranges overlap
          return newEventRange.overlaps(existingEventRange);
        } else return false;
      });
    },

    dropEvent(newEvent) {
      // Check for overlapping only if event.split and newEvent.newSplit are the same
      const isOverlap = this.events.some((event) => {
        // Exclude the newEvent by comparing unique identifiers
        if (event.id !== newEvent.event.id) {
          // Check for overlapping only if the split values match
          if (event.split === newEvent.newSplit) {
            return this.isOverlapping(newEvent, event);
          } else return false;
        }
      });

      if (isOverlap) {
        alert(
          "This event overlaps with an existing event in the same split. Please choose a different time."
        );
        this.addEventToEvents(newEvent);
        return;
      }
      // Replace the event in events array with newEvent.event if they have the same id
      this.events = this.events.map((event) => {
        if (event.id === newEvent.event.id) {
          return newEvent.event;
        } else {
          return event;
        }
      });
    },

    addEventToEvents(eventObj) {
      // Delete the event with the same id as eventObj.event.id from the events array
      this.events = this.events.filter(
        (event) => event.id !== eventObj.event.id
      );

      // Clone the event object to avoid modifying the original
      const newEvent = { ...eventObj.originalEvent };

      // Set the start to the oldDate as a Date object
      newEvent.start = new Date(eventObj.oldDate);

      // Calculate the end by adding the duration (in minutes) to the start
      newEvent.end = new Date(
        newEvent.start.getTime() + newEvent.duration * 60000
      ); // 60000 ms in a minute

      // Add the new event to the events array
      this.events.push(newEvent);
    },
    onEventCreate(newEvent) {
      // Adjust start and end times to nearest 30-minute interval
      newEvent.start = this.snapToNearest30(newEvent.start);
      newEvent.end = this.snapToNearest30(newEvent.end);

      // Now add the adjusted event to the calendar
      this.events.push(newEvent);
    },

    snapToNearest30(date) {
      const d = new Date(date);
      const minutes = d.getMinutes();

      if (minutes < 15) {
        // Snap to the start of the hour
        d.setMinutes(0);
      } else if (minutes >= 15 && minutes < 45) {
        // Snap to half-past the hour
        d.setMinutes(30);
      } else {
        // Snap to the start of the next hour
        d.setMinutes(0);
        d.setHours(d.getHours() + 1);
      }

      d.setSeconds(0, 0); // Reset seconds and milliseconds
      return d;
    },
    handleInput(event) {
      this.selectedStatus = event.target.value;
      this.selectedEvent.class = event.target.value + "-event";
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.selectedStatus = "disabled";
    },
    confirm() {
      // Find and replace the event with the same id
      const eventIndex = this.events.findIndex(
        (event) => event.id === this.selectedEvent.id
      );

      if (eventIndex !== -1) {
        // Replace the old event with the updated selectedEvent
        this.events[eventIndex] = { ...this.selectedEvent }; // Spread syntax to replace the object
      } else {
        this.events.push(this.selectedEvent);
      }

      // Close the dialog
      this.close();
    },

    deleteEvent() {
      // Find the index of the event with the same id
      const eventIndex = this.events.findIndex(
        (event) => event.id === this.selectedEvent.id
      );

      if (eventIndex !== -1) {
        // Remove the event from the array
        this.events.splice(eventIndex, 1);
      } else {
        console.log("Event not found, could not delete.");
      }

      // Close the dialog
      this.close();
    },

    selectStatus(value) {
      this.selectedStatus = value;
    },
    updateStatus() {
      // This method can be used if you want to react to changes in the select input
      console.log("Selected status changed to:", this.selectedStatus);
    },
    updateSplitDays() {
      if (this.selectedSport === "football") {
        this.splitDays = [
          {
            id: "football 1",
            class: "Football",
            label: "Terrain Football 1",
          },
          {
            id: "football 2",
            class: "Football",
            label: "Terrain Football 2",
          },
          {
            id: "football 3",
            class: "Football",
            label: "Terrain Football 3",
          },
        ];
      } else if (this.selectedSport === "padel") {
        this.splitDays = [
          { id: "padel 1", class: "Padel", label: "Terrain Padel 1" },
          { id: "padel 2", class: "Padel", label: "Terrain Padel 2" },
          { id: "padel 3", class: "Padel", label: "Terrain Padel 3" },
          { id: "padel 4", class: "Padel", label: "Terrain Padel 4" },
        ];
      } else if (this.selectedSport === "tennis") {
        this.splitDays = [
          {
            id: "tennis 1",
            class: "Tennis",
            label: "Terrain Tennis 1",
          },
          {
            id: "tennis 2",
            class: "Tennis",
            label: "Terrain Tennis 2",
          },
          {
            id: "tennis 3",
            class: "Tennis",
            label: "Terrain Tennis 3",
          },
          {
            id: "tennis 4",
            class: "Tennis",
            label: "Terrain Tennis 4",
          },
          {
            id: "tennis 5",
            class: "Tennis",
            label: "Terrain Tennis 5",
          },
        ];
      }
    },
    createEventInSplit(event) {
      // Check if event is overlapping events in the same split
      if (!this.checkForCreationOverlapping(event)) {
        if (event.split) {
          let eventClass = "";
          let clickable = false;
          let eventContent = "";
          let duration = 60; // Default duration

          // Check if event.split contains the word "padel"
          if (event.split.toLowerCase().includes("padel")) {
            duration = 90; // Set duration to 90 if "padel" is found
          }

          // Conditional content based on user type
          if (this.selectedUser === "sportma") {
            eventClass = "blue-event";
            eventContent = `
        <div class="event-content">
          <img src="https://sportma.ma/assets/sportmaApp-ERXWPjF0.jpeg" width="30" class="event-icon" alt="Icon" />
        </div>
      `;
          } else if (this.selectedUser === "manager") {
            eventClass = "yellow-event"; // Default class for manager
            clickable = true;
          } else {
            eventClass = "green-event"; // Default class for other users
            clickable = true;
          }

          this.$refs.vuecal2.createEvent(event.date, duration, {
            id: uuidv4(),
            title: `Nouvelle Reservation`,
            class: eventClass,
            content: eventContent,
            split: event.split,
            clickable: clickable,
            duration: duration,
          });
        }
      } else alert("This event overlaps with an existing event in the same split.");
    },
    changeEventClass(selectElement) {
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      const selectedClass = selectedOption.getAttribute("data-class");
      const eventElement = selectElement.closest(".vue-cal-event"); // Adjust selector based on your actual DOM structure

      if (eventElement) {
        // Update the event class
        eventElement.className = eventElement.className.replace(
          /(green-event|yellow-event|red-event)/,
          selectedClass
        );
      }
    },
    onEventClick(event, e) {
      if (event.clickable === true) {
        this.selectedEvent = event;
        this.open();
      }
    },
    scrollToCurrentTime() {
      // Access the calendar's scrollable background
      const calendar = this.$refs.vuecal2.$el.querySelector(".vuecal__bg");

      // Get the current hour and minutes as a decimal (e.g., 8:30 -> 8.5)
      const hours = 8;

      // If the calendar is available, scroll to the correct time
      if (calendar) {
        calendar.scrollTo({
          top: hours * this.timeCellHeight, // Scroll to the calculated time position
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style>
/* Styles for the user dropdown */
.user-selection {
  margin-bottom: 15px;
}

.user-selection select {
  padding: 5px;
  border: 2px solid #007bff;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
}

/* Styles for the radio buttons */
.sport-selection {
  margin-bottom: 20px;
}

.sport-selection label {
  margin-right: 15px;
  font-size: 16px;
  cursor: pointer;
}

.sport-selection input[type="radio"] {
  margin-right: 5px;
}

/* Event styles */
.blue-event {
  background-color: lightblue;
  color: white;
}

.green-event {
  background-color: lightgreen;
  color: white;
}

.red-event {
  background-color: red;
  color: white;
}

.yellow-event {
  background-color: #d6c32f;
  color: white;
}

/* Styling for sticky split labels */
.vuecal-fixed-splits .vuecal__split-label--sticky {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
}
</style>
