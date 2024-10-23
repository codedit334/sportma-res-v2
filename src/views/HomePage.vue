<template>
  <v-container>
    <v-row>
      <!-- Reservations Card -->
      <v-col cols="12" md="4">
        <v-card class="pa-3 card-hover modern-card reservations-card" color="primary" dark>
          <v-card-title>
            <v-icon left>event</v-icon>
            Reservations
          </v-card-title>
          <v-card-text>
            <div class="headline">{{ reservationsCount }}</div>
            <div class="subtitle-2">
              Growth: <span>{{ reservationsGrowth }}%</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Cancellations Card -->
      <v-col cols="12" md="4">
        <v-card class="pa-3 card-hover modern-card cancellations-card" color="error" dark>
          <v-card-title>
            <v-icon left>cancel</v-icon>
            Cancellations
          </v-card-title>
          <v-card-text>
            <div class="headline">{{ cancellationsCount }}</div>
            <div class="subtitle-2">
              Growth: <span>{{ cancellationsGrowth }}%</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Income Card -->
      <v-col cols="12" md="4">
        <v-card class="pa-3 card-hover modern-card income-card" color="success" dark>
          <v-card-title>
            <v-icon left>attach_money</v-icon>
            Income
          </v-card-title>
          <v-card-text>
            <div class="headline">{{ income }}</div>
            <div class="subtitle-2">
              Growth: <span>{{ incomeGrowth }}%</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="mt-4">
          <v-card-title>Reservations Overview</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedTimeFrame"
              :items="timeFrameOptions"
              label="Select Time Frame"
              @change="updateChartData"
            ></v-select>
            <div class="chart-container">
              <Bar v-if="chartData" :options="chartOptions" :data="chartData" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  components: {
    Bar,
  },
  data() {
    return {
      reservationsCount: 500,
      reservationsGrowth: 10, // 10% growth
      cancellationsCount: 50,
      cancellationsGrowth: -5, // -5% decrease
      income: "$10,000",
      incomeGrowth: 8, // 8% growth
      selectedTimeFrame: "months", // Default selection
      timeFrameOptions: ["days", "months"], // Options for the select
      chartData: {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            label: "Reservations per Month",
            backgroundColor: "#42A5F5",
            data: [40, 55, 75, 81, 56, 55],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    updateChartData() {
      console.log("Selected Time Frame:", this.selectedTimeFrame);
      // Update chart data based on selected time frame
      if (this.selectedTimeFrame === "days") {
        this.chartData = {
          labels: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          datasets: [
            {
              label: "Reservations per Day",
              backgroundColor: "#42A5F5",
              data: [10, 20, 30, 25, 15, 5, 20], // Example data for days
            },
          ],
        };
      } else {
        this.chartData = {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "Reservations per Month",
              backgroundColor: "#42A5F5",
              data: [40, 55, 75, 81, 56, 55],
            },
          ],
        };
      }
    },
  },
  mounted() {
    // Log the initial chartData to the console
    console.log("Chart Data:", this.chartData);
  },
};
</script>

<style scoped>
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-5px);
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Modern Card Styles */
.modern-card {
  border-radius: 15px; /* Rounded corners */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

/* Specific Card Colors */
.reservations-card {
  background: linear-gradient(135deg, #5a67d8, #4c51bf); /* Blue gradient */
}
.cancellations-card {
  background: linear-gradient(135deg, #e53e3e, #c53030); /* Red gradient */
}
.income-card {
  background: linear-gradient(135deg, #38a169, #2f855a); /* Green gradient */
}

/* Card Text Styles */
.headline {
  font-size: 2em; /* Larger headline */
  font-weight: bold; /* Bold text */
}

.subtitle-2 {
  font-size: 1em; /* Adjust subtitle size */
  color: #ffffff; /* Change subtitle color */
}
.chart-container {
  position: relative;
  width: 100%;
  height: 400px; /* Set a fixed height */
}
</style>
