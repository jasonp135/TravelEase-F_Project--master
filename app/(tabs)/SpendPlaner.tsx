import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define expense type
type Expense = {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
};

// Define category type with icon
type Category = {
  name: string;
  icon: string;
};

// Chart type enum
type ChartType = "list" | "visual";

export default function SpendPlanner() {
  // State for expenses and form inputs
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [totalSpent, setTotalSpent] = useState(0);
  const [currency, setCurrency] = useState("HKD");
  const [refreshing, setRefreshing] = useState(false);
  const [chartType, setChartType] = useState<ChartType>("list");

  // Screen width for charts
  const screenWidth = Dimensions.get("window").width - 70;

  // Available expense categories
  const categories: Category[] = [
    { name: "Food", icon: "restaurant" },
    { name: "Transport", icon: "bus" },
    { name: "Accommodation", icon: "bed" },
    { name: "Shopping", icon: "cart" },
    { name: "Attractions", icon: "ticket" },
    { name: "Other", icon: "ellipsis-horizontal" },
  ];

  // Chart colors
  const chartColors = [
    "#FF6384", // Red
    "#36A2EB", // Blue
    "#FFCE56", // Yellow
    "#4BC0C0", // Teal
    "#9966FF", // Purple
    "#FF9F40", // Orange
  ];

  // Calculate total spent whenever expenses change
  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalSpent(total);
  }, [expenses]);

  // Add new expense
  const addExpense = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount");
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      category: selectedCategory,
      amount: Number(amount),
      description: description || selectedCategory,
      date: new Date().toLocaleDateString(),
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
    setDescription("");
  };

  // Delete expense
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Calculate spending by category
  const getSpendingByCategory = () => {
    const categoryTotals: Record<string, number> = {};

    categories.forEach((cat) => {
      categoryTotals[cat.name] = 0;
    });

    expenses.forEach((expense) => {
      categoryTotals[expense.category] += expense.amount;
    });

    return categoryTotals;
  };

  const categoryTotals = getSpendingByCategory();

  // Get the maximum amount for any category (for bar scaling)
  const getMaxAmount = () => {
    return Math.max(...Object.values(categoryTotals), 1);
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Simulate data fetching
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRefreshing(false);
    } catch (error) {
      console.error('Refresh failed:', error);
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6C63FF"]}
            tintColor="#6C63FF"
            titleColor="#6C63FF"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spend Planner</Text>
          <Text style={styles.headerSubtitle}>
            Track your expenses in Hong Kong
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Spent</Text>
          <Text style={styles.summaryAmount}>
            {currency} {totalSpent.toFixed(2)}
          </Text>
          <View style={styles.currencySelector}>
            <TouchableOpacity
              style={[
                styles.currencyButton,
                currency === "HKD" && styles.selectedCurrency,
              ]}
              onPress={() => setCurrency("HKD")}
            >
              <Text style={styles.currencyText}>HKD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.currencyButton,
                currency === "USD" && styles.selectedCurrency,
              ]}
              onPress={() => setCurrency("USD")}
            >
              <Text style={styles.currencyText}>USD</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Expense Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Expense</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.amountInput}
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.descriptionInput}
              placeholder="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#999"
            />
          </View>

          {/* Category Selection */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={20}
                  color={selectedCategory === category.name ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.name &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.addButton} onPress={addExpense}>
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Expense Breakdown */}
        <View style={styles.breakdownContainer}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownTitle}>Expense Breakdown</Text>
            
            {/* Chart Type Selector */}
            <View style={styles.chartTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.chartTypeButton,
                  chartType === "list" && styles.activeChartTypeButton,
                ]}
                onPress={() => setChartType("list")}
              >
                <Ionicons
                  name="list"
                  size={18}
                  color={chartType === "list" ? "#6C63FF" : "#999"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chartTypeButton,
                  chartType === "visual" && styles.activeChartTypeButton,
                ]}
                onPress={() => setChartType("visual")}
              >
                <Ionicons
                  name="bar-chart"
                  size={18}
                  color={chartType === "visual" ? "#6C63FF" : "#999"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Display based on selected chart type */}
          {chartType === "list" && (
            <ScrollView style={styles.categoryBreakdown}>
              {Object.entries(categoryTotals).map(
                ([category, total]) =>
                  total > 0 && (
                    <View key={category} style={styles.categoryRow}>
                      <View style={styles.categoryInfo}>
                        <Ionicons
                          name={
                            categories.find((c) => c.name === category)
                              ?.icon as any
                          }
                          size={20}
                          color="#333"
                        />
                        <Text style={styles.categoryName}>{category}</Text>
                      </View>
                      <Text style={styles.categoryAmount}>
                        {currency} {total.toFixed(2)}
                      </Text>
                    </View>
                  )
              )}
            </ScrollView>
          )}

          {chartType === "visual" && expenses.length > 0 && (
            <ScrollView style={styles.visualChartContainer}>
              {Object.entries(categoryTotals)
                .filter(([_, total]) => total > 0)
                .map(([category, total], index) => {
                  const percentage = (total / totalSpent) * 100;
                  const barWidth = (total / getMaxAmount()) * screenWidth;
                  const color = chartColors[index % chartColors.length];
                  
                  return (
                    <View key={category} style={styles.chartItem}>
                      <View style={styles.chartLabelContainer}>
                        <Ionicons
                          name={categories.find(c => c.name === category)?.icon as any}
                          size={16}
                          color="#333"
                        />
                        <Text style={styles.chartLabel}>{category}</Text>
                        <Text style={styles.chartPercentage}>
                          {percentage.toFixed(1)}%
                        </Text>
                      </View>
                      <View style={styles.barContainer}>
                        <View 
                          style={[
                            styles.bar, 
                            { width: barWidth, backgroundColor: color }
                          ]} 
                        >
                          {barWidth > 60 && (
                            <Text style={styles.barAmountInside}>
                              {currency} {total.toFixed(0)}
                            </Text>
                          )}
                        </View>
                        {barWidth <= 60 && (
                          <Text style={styles.barAmountOutside}>
                            {currency} {total.toFixed(0)}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              }
            </ScrollView>
          )}

          {expenses.length === 0 && chartType === "visual" && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                Add expenses to see charts
              </Text>
            </View>
          )}
        </View>

        {/* Expense List */}
        <View style={styles.expenseListContainer}>
          <Text style={styles.expenseListTitle}>Recent Expenses</Text>
          <ScrollView style={styles.expenseList}>
            {expenses.length === 0 ? (
              <Text style={styles.noExpenses}>No expenses recorded yet</Text>
            ) : (
              expenses.map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseCategory}>
                      {expense.category}
                    </Text>
                    <Text style={styles.expenseDescription}>
                      {expense.description}
                    </Text>
                    <Text style={styles.expenseDate}>{expense.date}</Text>
                  </View>
                  <View style={styles.expenseAmountContainer}>
                    <Text style={styles.expenseAmount}>
                      {currency} {expense.amount.toFixed(2)}
                    </Text>
                    <TouchableOpacity onPress={() => deleteExpense(expense.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ff6b6b"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  summaryCard: {
    backgroundColor: "#6C63FF",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  currencySelector: {
    flexDirection: "row",
    marginTop: 10,
  },
  currencyButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  selectedCurrency: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  currencyText: {
    color: "#fff",
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  descriptionInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
  },
  categoryScroll: {
    flexDirection: "row",
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  selectedCategory: {
    backgroundColor: "#6C63FF",
  },
  categoryText: {
    marginLeft: 5,
    color: "#333",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  breakdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  chartTypeSelector: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 4,
  },
  chartTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeChartTypeButton: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryBreakdown: {
    maxHeight: 200,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryName: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  visualChartContainer: {
    maxHeight: 250,
    paddingVertical: 10,
  },
  chartItem: {
    marginBottom: 15,
  },
  chartLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  chartLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  chartPercentage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  bar: {
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  barAmountInside: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  barAmountOutside: {
    marginLeft: 8,
    fontSize: 12,
    color: '#333',
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
  },
  expenseListContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 222,
  },
  expenseListTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  expenseList: {
    flex: 1,
  },
  noExpenses: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  expenseDetails: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  expenseDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  expenseAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginRight: 10,
  },
});