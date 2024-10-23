<template>
  <v-container>
    <v-row>
      <!-- Reservations Card -->
      <v-col cols="12" md="4">
        <v-card
          class="pa-3 card-hover"
          color="primary"
          dark
        >
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
        <v-card
          class="pa-3 card-hover"
          color="error"
          dark
        >
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
        <v-card
          class="pa-3 card-hover"
          color="success"
          dark
        >
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      reservationsCount: 500,
      reservationsGrowth: 10, // 10% growth
      cancellationsCount: 50,
      cancellationsGrowth: -5, // -5% decrease
      income: '$10,000',
      incomeGrowth: 8, // 8% growth
    };
  }
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
</style>
