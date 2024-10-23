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
      :on-event-click="onEventClick"
    >
      <template #split-label="{ split, view }">
        <strong :style="`color: ${split.color}`">{{ split.label }}</strong>
      </template>
    </vue-cal>
  </div>

  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title class="headline">Change Status</v-card-title>
      <v-card-text>
        <div class="event-content">
          <select @input="handleInput" style="width: 100%; height: 50px">
            <option value="green" data-class="green-event">🟢 Payee</option>
            <option value="yellow" data-class="yellow-event">🟡 en-cours</option>
            <option value="red" data-class="red-event">🔴 Annulee</option>
          </select>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      timeCellHeight: 80, // Height of one hour in pixels
      now: new Date(), // Get the current time
      selectedUser: "sportma", // Default selected user
      selectedSport: "football", // Default selected sport
      events: [],
      stickySplitLabels: true,
      minCellWidth: 400,
      minSplitWidth: 300,
      splitDays: [], // To be updated based on selected sport
      dialog: false,
      selectedEvent: null,
      selectedStatus: null,
    };
  },
  mounted() {
    this.updateSplitDays(); // Initialize splitDays on mount
  },
  methods: {
    handleInput(event) {
      this.selectedStatus = event.target.value;
      this.selectedEvent.class = event.target.value + "-event";
      console.log("Input value:", event.target.value);
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    confirm() {
      // Handle the confirmation logic
      console.log("Status updated to:", this.selectedStatus);
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
      if (event.split) {
        let eventClass = "";
        let eventContent = "";

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
        } else {
          eventClass = "green-event"; // Default class for other users
          eventContent = `<span>Nouvelle Reservation</span>`;
        }

        this.$refs.vuecal2.createEvent(event.date, 60, {
          title: `Nouvelle Reservation`,
          class: eventClass,
          content: eventContent,
          split: event.split,
        });
      }
    },
    changeEventClass(selectElement) {
      console.log("Working");
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
      this.selectedEvent = event;
      this.open();
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
