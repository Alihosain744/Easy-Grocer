import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import "./index.css";
import Cart from "./pages/Cart";
import CheckoutForm from "./components/CheckoutForm";
import { useState } from "react";
import SignUp from "./pages/SignUp";

import AdminPage from "./pages/AdminPage";
import Summary from "./components/Summary";
import FormAddExpense from "./components/FormAddExpense";
import Expenses from "./components/Expenses";
import Incomes from "./components/Incomes";
import FormAddIncome from "./components/FormAddIncome";
import Products from "./components/Products";
import Orders from "./components/Orders";
import OrderForm from "./components/OrderForm";
import CustomerDashboard from "./components/CustomerDashboard.jsx";
import { OrderProvider } from "./Contexts/OrdersContext";
import { UserProvider } from "./Contexts/UsersContext";
import { CategoryProvider, ProductProvider } from "./Contexts/ProductsContext";
import Categories from "./components/Categories";
import { ExpenseProvider, IncomeProvider } from "./Contexts/FinanceContext";
import { CartProvider } from "./Contexts/CartContext";

import { AdminRoute, ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./Contexts/AuthContext";
import TrackOrder from "./components/TrackOrder";
import Users from "./components/Users";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              index
              element={
                <CartProvider>
                  <ProductProvider>
                    <CategoryProvider>
                      <Homepage
                        isMenuOpen={isMenuOpen}
                        setIsMenuOpen={setIsMenuOpen}
                      />
                    </CategoryProvider>
                  </ProductProvider>
                </CartProvider>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <OrderProvider>
                    <AdminPage
                      isMenuOpen={isMenuOpen}
                      setIsMenuOpen={setIsMenuOpen}
                    />
                  </OrderProvider>
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="summary" replace />} />

              <Route
                path="summary"
                element={
                  <OrderProvider>
                    <IncomeProvider>
                      <ExpenseProvider>
                        <Summary />
                      </ExpenseProvider>
                    </IncomeProvider>
                  </OrderProvider>
                }
              />

              <Route
                path="expenses"
                element={
                  <CartProvider>
                    <CategoryProvider>
                      <ProductProvider>
                        <ExpenseProvider>
                          <Expenses />
                        </ExpenseProvider>
                      </ProductProvider>
                    </CategoryProvider>
                  </CartProvider>
                }
              />
              <Route
                path="addExpense"
                element={
                  <CartProvider>
                    <OrderProvider>
                      <IncomeProvider>
                        <CategoryProvider>
                          <ProductProvider>
                            <ExpenseProvider>
                              <FormAddExpense />
                            </ExpenseProvider>
                          </ProductProvider>
                        </CategoryProvider>
                      </IncomeProvider>
                    </OrderProvider>
                  </CartProvider>
                }
              />
              <Route
                path="incomes"
                element={
                  <CartProvider>
                    <OrderProvider>
                      <ExpenseProvider>
                        <CategoryProvider>
                          <ProductProvider>
                            <IncomeProvider>
                              <Incomes />
                            </IncomeProvider>
                          </ProductProvider>
                        </CategoryProvider>
                      </ExpenseProvider>
                    </OrderProvider>
                  </CartProvider>
                }
              />
              <Route
                path="addIncome"
                element={
                  <CartProvider>
                    <OrderProvider>
                      <ExpenseProvider>
                        <CategoryProvider>
                          <ProductProvider>
                            <IncomeProvider>
                              <FormAddIncome />
                            </IncomeProvider>
                          </ProductProvider>
                        </CategoryProvider>
                      </ExpenseProvider>
                    </OrderProvider>
                  </CartProvider>
                }
              />
              <Route
                path="products"
                element={
                  <CartProvider>
                    <CategoryProvider>
                      <ProductProvider>
                        <Products addProductBtn={true} action={true} />
                      </ProductProvider>
                    </CategoryProvider>
                  </CartProvider>
                }
              />

              <Route
                path="categories"
                element={
                  <CartProvider>
                    <ProductProvider>
                      <CategoryProvider>
                        <Categories />
                      </CategoryProvider>
                    </ProductProvider>
                  </CartProvider>
                }
              />

              <Route
                path="orders"
                element={
                  <UserProvider>
                    <CartProvider>
                      <ProductProvider>
                        <CategoryProvider>
                          <OrderProvider>
                            <IncomeProvider>
                              <Orders />
                            </IncomeProvider>
                          </OrderProvider>
                        </CategoryProvider>
                      </ProductProvider>
                    </CartProvider>
                  </UserProvider>
                }
              />

              <Route
                path="addOrder"
                element={
                  <UserProvider>
                    <CartProvider>
                      <ProductProvider>
                        <OrderProvider>
                          <IncomeProvider>
                            <OrderForm />
                          </IncomeProvider>
                        </OrderProvider>
                      </ProductProvider>
                    </CartProvider>
                  </UserProvider>
                }
              />

              <Route
                path="users"
                element={
                  <CategoryProvider>
                    <ProductProvider>
                      <UserProvider>
                        <Users />
                      </UserProvider>
                    </ProductProvider>
                  </CategoryProvider>
                }
              />
            </Route>

            <Route
              path="trackOrder"
              element={
                <OrderProvider>
                  <TrackOrder />
                </OrderProvider>
              }
            />
            <Route
              path="customer"
              element={
                <ProtectedRoute>
                  <OrderProvider>
                    <IncomeProvider>
                      <CartProvider>
                        <CategoryProvider>
                          <ProductProvider>
                            <CustomerDashboard />
                          </ProductProvider>
                        </CategoryProvider>
                      </CartProvider>
                    </IncomeProvider>
                  </OrderProvider>
                </ProtectedRoute>
              }
            >
              <Route
                path="form"
                element={
                  <UserProvider>
                    <CheckoutForm />
                  </UserProvider>
                }
              />
            </Route>
            <Route
              path="/cart"
              element={
                <OrderProvider>
                  <CartProvider>
                    <Cart
                      isMenuOpen={isMenuOpen}
                      setIsMenuOpen={setIsMenuOpen}
                    />
                  </CartProvider>
                </OrderProvider>
              }
            >
              <Route
                path="form"
                element={
                  <UserProvider>
                    <CheckoutForm />
                  </UserProvider>
                }
              />
            </Route>

            <Route
              path="/signin"
              element={
                <Login isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              }
            />

            <Route
              path="/signup"
              element={
                <UserProvider>
                  <SignUp
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                </UserProvider>
              }
            />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
