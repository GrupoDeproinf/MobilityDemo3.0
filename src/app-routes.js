import { 
    HomePage, 
    TasksPage, 
    ProfilePage, 
    ClientsPage, 
    FormsPage, 
    RegionsPage, 
    BanckAccountPage, 
    EstablishmentPage, 
    ReportPage,
    Gallery,
    EditForm,
    EstablishmentNew,
    Activation,
    AssigmentClients
} from './pages';
import User from './pages/User/User';
import { LoginForm } from './components';
import Seguimiento from './pages/gps/gps';
import FormView from './pages/forms/formView';
import Version from './pages/versionControl/version';
import Assignment from './pages/Assignment/Assignment';
import PreRegister from './pages/PreRegister/PreRegister';
import { withNavigationWatcher } from './contexts/navigation';
import UserSyncGrid from './pages/GridSyncUsers/GridSyncUsers';
import AssignmentUser from './pages/AssignmentUser/AssignmentUser';
import AssignmentNew from './pages/AssignmentNew/AssignmentNew';
import SpecialReports from './pages/SpecialsReports/SpecialReports';
import UserSyncGridVentas from './pages/GridSyncUsersVentas/GridSyncUsersVentas';
import OrdenesCompra from './pages/ordenDeCompras/ordenDeCompras';
import UserCoord from './pages/UserCoord/UserCoord';
import Reportspost from './pages/reportspost/reportspost';
import QuestionsPage from './pages/questions-page/questions-page';
import Access from './pages/access/access';
import Roles from './pages/roles/roles';
import supervisiones from './pages/superviciones/supervisiones';
import RutasIa from './pages/rutasIa/RutasIa';
import FormManager from "./pages/FormManager/formManager";
import Dotaciones from "./pages/DotacionReport/dotacion";
import InventarioPage from "./pages/inventario/inventario";

import Encuestas from './pages/encuestas/encuestas';

const routes = [
    {
        path: '/',
        element: localStorage.getItem('userToken') ? HomePage : LoginForm
    },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/home',
        element: HomePage
    },
    {
        path: '/clientes',
        element: ClientsPage
    },
    {
        path: '/formularios',
        element: FormsPage
    },
    {
        path: '/regiones',
        element: RegionsPage
    },
    {
        path: '/cuentaBancaria',
        element: BanckAccountPage
    },
    {
        path: '/PreRegister',
        element: PreRegister
    },
    {
        path:'/establecimientos',
        element: EstablishmentPage
    },
    {
        path:'/reportes',
        element: ReportPage
    },
    {
        path:'/User',
        element: User
    },
    {
        path:'/Form',
        element: FormView
    },
    {
        path:'/editForm',
        element: EditForm
    },
    
    {
        path:'/registroFotografico',
        element: Gallery
    },
    {
        path:'/AsignacionEstablecimiento',
        element: Assignment
    },
    {
        path:'/AsignacionEstablecimientoClientes',
        element: AssigmentClients
    },
    {
        path:'/AsignNewestablishments',
        element: AssignmentNew
    },
    {
        path:'/AsignacionUsuarios',
        element: AssignmentUser
    },
    {
        path:'/Seguimiento',
        element: Seguimiento
    },
    {
        path:'/versiones',
        element: Version
    },
    {
        path:'/specialreport',
        element: SpecialReports
    },
    {
        path:'/gridSync',
        element: UserSyncGrid
    },
    {
        path:'/gridSyncVentas',
        element: UserSyncGridVentas
    },
    {
        path:'/ordenesCompra',
        element: OrdenesCompra
    },
    {
        path:'/UserCoord',
        element: UserCoord
    },
    {
        path:'/reportspost',
        element: Reportspost
    },
    {
        path: '/establecimientosNuevos',
        element: EstablishmentNew
    },
    {
        path: '/activacion',
        element: Activation
    },
    {
        path: '/frequencyQuestions',
        element: QuestionsPage
    },
    {
        path: '/access',
        element: Access
    },
    {
        path: '/roles',
        element: Roles
    },
    {
        path: '/encuestas',
        element: Encuestas
    },
    {
        path: '/supervisiones',
        element: supervisiones
    },
    {
        path: '/rutasIA',
        element: RutasIa
    },
    {
        path: "/dotaciones",
        element: Dotaciones,
      },
      {
        path: "/inventario_dotacion",
        element: InventarioPage,
      },
      {
        path: "/formManager",
        element: FormManager,
      },
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
