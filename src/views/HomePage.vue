<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-3">
          <v-card-title>Reservations</v-card-title>
          <v-card-text>
            <div class="headline">{{ reservationsCount }}</div>
            <div class="subtitle-2">
              Growth: <span>{{ reservationsGrowth }}%</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-3">
          <v-card-title>Cancellations</v-card-title>
          <v-card-text>
            <div class="headline">{{ cancellationsCount }}</div>
            <div class="subtitle-2">
              Growth: <span>{{ cancellationsGrowth }}%</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-3">
          <v-card-title>Income</v-card-title>
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
      reservationsGrowth: 10, // e.g., 10% growth
      cancellationsCount: 50,
      cancellationsGrowth: -5, // e.g., -5% decrease
      income: '$10,000',
      incomeGrowth: 8, // e.g., 8% growth
    };
  }
};
</script>
