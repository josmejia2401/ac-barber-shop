import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
//import logo from './logo.svg';
import './App.css';
import { isAuthenticated } from "./lib/auth";
import storage from "./lib/storage";

import AuthLoginView from '../src/views/auth/login';
import AuthRegisterView from '../src/views/auth/register';

import ProjectsView from '../src/views/projects/view';
import FunctionalitiesView from '../src/views/functionalities/view';
import TasksView from '../src/views/tasks/view';
import LogsView from '../src/views/record-logs/view';
import ChatView from '../src/views/chats';


import CustomersManagementView from '../src/views/customers/management/view';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      preloader: true,
      currentPathName: "",
      isAuthenticatedValue: false
    };

    this.refreshPage = this.refreshPage.bind(this);
    this.validateStatus = this.validateStatus.bind(this);
    this.checkDocumentState = this.checkDocumentState.bind(this);
    this.handleClickOpenNav = this.handleClickOpenNav.bind(this);
  }

  componentDidMount() {
    this.timeoutId = setInterval(() => this.validateStatus(), 1000);
    this.checkDocumentState();
  }

  componentWillUnmount() {
    clearInterval(this.timeoutId);
    document.removeEventListener('load', () => this.setState({ preloader: false }));
  }


  validateStatus = () => {
    const auth = isAuthenticated();
    const currentPathName = window.location.pathname;
    const { isAuthenticatedValue } = this.state;
    this.setState({ currentPathName: currentPathName || "" });

    if (isAuthenticatedValue !== auth) {
      this.setState({ isAuthenticatedValue: auth });
    }
    if (auth === false) {
      this.refreshPage(currentPathName);
    }
  }

  refreshPage = (currentPathName) => {
    const exists = [currentPathName, window.location.pathname]
      .filter(p => p.includes("auth"))[0];
    if (!exists) {
      storage.clear();
      window.location.replace("/");
    }
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
            <Link className="navbar-brand fw-bold">AppMa</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"
              onClick={this.handleClickOpenNav}>
              Menú
              <i className="fa-solid fa-bars ms-2"></i>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ms-auto me-4 my-3 my-lg-0">
                <li className="nav-item">
                  <Link className={`${this.state.currentPathName === '/projects' ? 'active' : ''} nav-link me-lg-3`} to={"/projects"}>Proyectos</Link>
                </li>
                <li className="nav-item">
                  <Link className={`${this.state.currentPathName === '/functionalities' ? 'active' : ''} nav-link me-lg-3`} to={"/functionalities"}>Funcionalidades</Link>
                </li>
                <li className="nav-item">
                  <Link className={`${this.state.currentPathName === '/tasks' ? 'active' : ''} nav-link me-lg-3`} to={"/tasks"}>Tareas</Link>
                </li>
                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-secondary dropdown-toggle" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Inventario
                    </Link>
                    <ul className="dropdown-menu show">
                      <li><Link className="dropdown-item" to="#">Gestión de Productos</Link></li>
                      <li><Link className="dropdown-item" to="#">Control Stock</Link></li>
                      <li><Link className="dropdown-item" to="#">Historial de Movimientos</Link></li>
                      <li><Link className="dropdown-item" to="#">Gestión de lotes</Link></li>
                      <li><Link className="dropdown-item" to="#">Importación/exportación</Link></li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-secondary dropdown-toggle" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Clientes
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="#">Gestión de Clientes</Link></li>
                      <li><Link className="dropdown-item" to="#">Seguimiento de interacciones y preferencias</Link></li>
                      <li><Link className="dropdown-item" to="#">Historial de transacciones</Link></li>
                      <li><Link className="dropdown-item" to="#">Automatización de marketing y segmentación de clientes.</Link></li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-secondary dropdown-toggle" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Empleados
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="#">Gestión de Empleados</Link></li>
                      <li><Link className="dropdown-item" to="#">Control de datos personales y roles.</Link></li>
                      <li><Link className="dropdown-item" to="#">Gestión de horarios y asistencias.</Link></li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-secondary dropdown-toggle" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Proveedores
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="#">Gestión de Proveedores</Link></li>
                      <li><Link className="dropdown-item" to="#">Seguimiento de órdenes de compra.</Link></li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-secondary dropdown-toggle" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Gastos e Ingresos
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="#">Registro y categorización de ingresos y egresos.</Link></li>
                      <li><Link className="dropdown-item" to="#">Conciliación con cuentas bancarias.</Link></li>
                    </ul>
                  </div>
                </li>


              </ul>
              <button className="btn btn-primary rounded-pill px-3 mb-2 mb-lg-0" data-bs-toggle="modal" data-bs-target="#feedbackModal">
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

      <Route exact path="/projects" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/functionalities" element={<FunctionalitiesView {...props} location={useLocation()} navigate={useNavigate()}></FunctionalitiesView>} />
      <Route exact path="/tasks" element={<TasksView {...props} location={useLocation()} navigate={useNavigate()}></TasksView>} />
      <Route exact path="/logs" element={<LogsView {...props} location={useLocation()} navigate={useNavigate()}></LogsView>} />
      <Route exact path="/chats" element={<ChatView {...props} location={useLocation()} navigate={useNavigate()}></ChatView>} />

      <Route exact path="/customers/customer-management" element={<CustomersManagementView {...props} location={useLocation()} navigate={useNavigate()}></CustomersManagementView>} />
      <Route exact path="/customers/interaction-preference-tracking" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/customers/transaction-history" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/customers/marketing-automation-customer-segmentation" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />

      <Route exact path="/employees/employee-management" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/employees/control-personal-data-roles" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/employees/management-schedules-attendance" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />

      <Route exact path="/suppliers/supplier-management" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/suppliers/purchase-order-tracking" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />

      <Route exact path="/inventory/products" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/inventory/stock-control" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/inventory/movement-history" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/inventory/batch-management" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/inventory/import-export" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />

      <Route exact path="/expenses-income/recording--categorizing-income-expenses" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />
      <Route exact path="/expenses-income/reconciliation-bank-accounts" element={<ProjectsView {...props} location={useLocation()} navigate={useNavigate()}></ProjectsView>} />

      <Route path="*" element={<Navigate to={props.isAuthenticated ? "/projects" : "/auth/login"} replace></Navigate>} />
    </Routes>
  )
}

export default App;
