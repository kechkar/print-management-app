import AdminDashboardImg from '../../assets/HomePagePics/AdminDashboard.jpg';
import AddPrinterImg from '../../assets/HomePagePics/CreerUnImprimeur.jpg';
import AddDeptImg from '../../assets/HomePagePics/CreerUnDepartement.png';
import CreateRequestImg from '../../assets/HomePagePics/CreerDemandeImpression.jpg';
import DemandeTerminé from '../../assets/HomePagePics/DemandeTerminé.png';
import DemandeApprouvé from '../../assets/HomePagePics/DemandeApprouvé.png';
import AddTeacherImg from '../../assets/HomePagePics/CreerUnEnseignant.jpg';

const rolesConfig = {
    ADMIN: {
      name: "Administrateur",
      cards: [
        { title: "Tableau de bord", image: AdminDashboardImg, link: "/AdminDashboard" },
        { title: "Ajouter un imprimeur", image: AddPrinterImg, link: "/CreatePrinter" },
        { title: "Ajouter un département", image: AddDeptImg, link: "/CreateDepartment" },
      ],
    },
    ENSEIGNANT: {
      name: "Enseignant",
      cards: [
        { title: "Tableau de bord", image: AdminDashboardImg, link: "/TeacherDashboard" },
        { title: "Créer une demande d’impression", image: CreateRequestImg, link: "/CreatePrintRequest" },
      ],
    },
    IMPRIMERIE: {
      name: "Imprimeur",
      cards: [
        { title: "Tableau de bord", image: AdminDashboardImg, link: "/PrinterDashboard" },
      ],
    },
    CHEF_DE_DEPARTEMENT: {
      name: "Chef de département",
      cards: [
        { title: "Tableau de bord", image: AdminDashboardImg, link: "/Dashboard" },
        { title: "Ajouter un enseignant", image: AddTeacherImg, link: "/CreateTeacher" },
      ],
    },
  };
  
  export default rolesConfig;
  