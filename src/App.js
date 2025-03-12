import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
//import logo from './logo.svg';
import './App.css';
import { isAuthenticated } from "./lib/auth";
import storage from "./lib/storage";

import AuthLoginView from '../src/views/auth/login';
import AuthRegisterView from '../src/views/auth/register';

import EmployeesManagementView from '../src/views/employees/management/view';
import CustomersManagementView from '../src/views/customers/management/view';

import InventaryManagementView from '../src/views/inventory/management/view';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      preloader: true,
      currentPathName: "",
      isAuthenticatedValue: false
    };

    this.checkPath = this.checkPath.bind(this);
    this.checkDocumentState = this.checkDocumentState.bind(this);
    this.handleClickOpenNav = this.handleClickOpenNav.bind(this);
  }

  componentDidMount() {
    this.timeoutId = setInterval(() => this.checkPath(), 500);
    this.checkDocumentState();
  }

  componentWillUnmount() {
    clearInterval(this.timeoutId);
    document.removeEventListener('load', () => this.setState({ preloader: false }));
  }

  checkPath() {
    const pathname = window.location.pathname;
    const isAuthenticatedValue = isAuthenticated();
    // Si el usuario está autenticado y está en /login o /register, redirige a /home
    if (pathname && isAuthenticatedValue && (pathname.includes('login') || pathname.includes('register'))) {
      window.location.replace('/employees/employee-management');
    }
    // Si el usuario no está autenticado y no está en /login o /register, redirige a /login
    else if (pathname && !isAuthenticatedValue && !pathname.includes('login') && !pathname.includes('register')) {
      storage.clear();
      window.location.replace('/auth/login');
    }
    this.setState({ currentPathName: pathname, isAuthenticatedValue: isAuthenticatedValue });
  }


  checkDocumentState = () => {
    if (document.readyState === "complete") {
      this.setState({ preloader: false });
    } else {
      window.addEventListener('load', () => this.setState({ preloader: false }));
    }
  }

  handleClickOpenNav = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      const navbarNavDropdown = document.getElementById("navbarResponsive");
      navbarNavDropdown.classList.toggle("show");
    }
  }

  render() {
    return (<Router>
      <div className="main-router">
        {this.state.preloader && <div className="d-flex justify-content-center-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>}

        {this.state.isAuthenticatedValue && <nav className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm" id="mainNav">
          <div className="container px-5">
            <Link className="navbar-brand fw-bold">CELESTE</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={this.handleClickOpenNav}>
              Menú
              <i className="fa-solid fa-bars ms-2"></i>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ms-auto me-4 my-3 my-lg-0">
                {/*<li className="nav-item">
                  <Link className={`${this.state.currentPathName === '/projects' ? 'active' : ''} nav-link me-lg-3`} to={"/projects"}>Proyectos</Link>
                </li>
                <li className="nav-item">
                  <Link className={`${this.state.currentPathName === '/functionalities' ? 'active' : ''} nav-link me-lg-3`} to={"/functionalities"}>Funcionalidades</Link>
                </li>
                <li className="nav-item">
                  <Link className={`${this.state.currentPathName === '/tasks' ? 'active' : ''} nav-link me-lg-3`} to={"/tasks"}>Tareas</Link>
                </li>*/}

                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-navbar dropdown-toggle a-navbar d-flex align-items-center" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-users me-2"></i>
                        <span className="small">Empleados</span>
                      </span>
                    </Link>
                    <ul className="dropdown-menu hide">
                      <li>
                        <Link className="dropdown-item" to="#">
                          <span className="d-flex align-items-center">
                            <i className="fa-solid fa-people-roof me-2"></i>
                            <span className="small">Gestión de Empleados</span>
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-navbar dropdown-toggle a-navbar d-flex align-items-center" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-people-arrows me-2"></i>
                        <span className="small">Clientes</span>
                      </span>
                    </Link>
                    <ul className="dropdown-menu hide">
                      <li>
                        <Link className="dropdown-item" to="#">
                          <span className="d-flex align-items-center">
                            <i className="fa-solid fa-people-roof me-2"></i>
                            <span className="small">Gestión de Clientes</span>
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          <span className="d-flex align-items-center">
                            <i className="fa-solid fa-clock-rotate-left me-2"></i>
                            <span className="small">Historial de transacciones</span>
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-navbar dropdown-toggle a-navbar d-flex align-items-center" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-truck-field me-2"></i>
                        <span className="small">Proveedores</span>
                      </span>
                    </Link>
                    <ul className="dropdown-menu hide">
                      <li>
                        <Link className="dropdown-item" to="#">
                          <span className="d-flex align-items-center">
                            <i className="fa-solid fa-boxes-packing me-2"></i>
                            <span className="small">Gestión de Proveedores</span>
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          <span className="d-flex align-items-center">
                            <i className="fa-solid fa-shop me-2"></i>
                            <span className="small">Seguimiento de órdenes de compra</span>
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-navbar dropdown-toggle a-navbar d-flex align-items-center" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-boxes-stacked me-2"></i>
                        <span className="small">Inventario</span>
                      </span>
                    </Link>
                    <ul className="dropdown-menu hide">
                      <li>
                        <Link className="dropdown-item" to="#">
                          <span className="d-flex align-items-center">
                            <i className="fa-solid fa-sitemap me-2"></i>
                            <span className="small">Gestión de Productos</span>
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          <span className="d-flex align-items-center">
                            <i className="fa-solid fa-cubes-stacked me-2"></i>
                            <span className="small">Control de Stock</span>
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          <span className="d-flex align-items-center">
                            <i className="fa-solid fa-file-export me-2"></i>
                            <span className="small">Importación/exportación</span>
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-navbar dropdown-toggle a-navbar d-flex align-items-center" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-money-bill-transfer me-2"></i>
                        <span className="small">Gastos e Ingresos</span>
                      </span>
                    </Link>
                    <ul className="dropdown-menu hide">
                      <li><Link className="dropdown-item" to="#">Registro y categorización de ingresos y egresos.</Link></li>
                      <li><Link className="dropdown-item" to="#">Conciliación con cuentas bancarias.</Link></li>
                    </ul>
                  </div>
                </li>

              </ul>
              <button className="btn btn-navbar rounded-pill px-3 mb-2 mb-lg-0" data-bs-toggle="modal" data-bs-target="#feedbackModal">
                <span className="d-flex align-items-center">
                  <i className="fa-solid fa-door-closed me-2"></i>
                  <span className="small">Iniciar sesión</span>
                </span>
              </button>
            </div>
          </div>
        </nav>}

        <main>
          <Inner {...this.props} isAuthenticatedValue={this.state.isAuthenticatedValue}></Inner>
        </main>
      </div>
    </Router>);
  }
}

function Inner(props) {
  return (
    <Routes location={useLocation()} {...props}>
      <Route exact path="/auth/login" element={<AuthLoginView {...props} location={useLocation()} navigate={useNavigate()}></AuthLoginView>} />
      <Route exact path="/auth/register" element={<AuthRegisterView {...props} location={useLocation()} navigate={useNavigate()}></AuthRegisterView>} />

      <Route exact path="/customers/customer-management" element={<CustomersManagementView {...props} location={useLocation()} navigate={useNavigate()}></CustomersManagementView>} />
      <Route exact path="/customers/interaction-preference-tracking" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />
      <Route exact path="/customers/transaction-history" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />
      <Route exact path="/customers/marketing-automation-customer-segmentation" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />

      <Route exact path="/employees/employee-management" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />
      <Route exact path="/employees/control-personal-data-roles" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />
      <Route exact path="/employees/management-schedules-attendance" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />

      <Route exact path="/suppliers/supplier-management" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />
      <Route exact path="/suppliers/purchase-order-tracking" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />

      <Route exact path="/inventory/products-management" element={<InventaryManagementView {...props} location={useLocation()} navigate={useNavigate()}></InventaryManagementView>} />
      <Route exact path="/inventory/stock-control" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />
      <Route exact path="/inventory/movement-history" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />
      <Route exact path="/inventory/batch-management" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />
      <Route exact path="/inventory/import-export" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />

      <Route exact path="/expenses-income/recording--categorizing-income-expenses" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />
      <Route exact path="/expenses-income/reconciliation-bank-accounts" element={<EmployeesManagementView {...props} location={useLocation()} navigate={useNavigate()}></EmployeesManagementView>} />

      <Route path="*" element={<Navigate to={props.isAuthenticated ? "/employees/employee-management" : "/auth/login"} replace></Navigate>} />
    </Routes>
  )
}

export default App;
