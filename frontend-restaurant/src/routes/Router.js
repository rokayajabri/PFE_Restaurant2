import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/loader/Loadable';


/****Layouts*****/

const FullLayout = Loadable(lazy(() => import('../layouts/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/BlankLayout')));

/***** Pages ****/
/***** Admin ****/
const Login = Loadable(lazy(() => import('../views/AdminPages/Login')));

const DashboardsAdmin = Loadable(lazy(() => import('../views/AdminPages/AdminDashboard')));
const Users = Loadable(lazy(() => import('../views/AdminPages/AllUser')));
const EditUsers = Loadable(lazy(() => import('../views/AdminPages/EditUser')));
const AddUsers = Loadable(lazy(() => import('../views/AdminPages/AddUser')));
const Products = Loadable(lazy(() => import('../views/AdminPages/AllProduit')));
const EditProducts = Loadable(lazy(() => import('../views/AdminPages/EditProduit')));
const AddProducts = Loadable(lazy(() => import('../views/AdminPages/AddProduit')));
const Categories = Loadable(lazy(() => import('../views/AdminPages/AllCategorie')));
const AddCategories = Loadable(lazy(() => import('../views/AdminPages/AddCategory')));
const EditCategories = Loadable(lazy(() => import('../views/AdminPages/EditCategorie')));
const ProductsByCategory = Loadable(lazy(() => import('../views/AdminPages/ProductsByCategory')));
const Ingrédients = Loadable(lazy(() => import('../views/AdminPages/AllIngredient')));
const AddIngrédients = Loadable(lazy(() => import('../views/AdminPages/AddIngredient')));
const EditIngrédients = Loadable(lazy(() => import('../views/AdminPages/EditIngredient')));
const CompositionsProduit = Loadable(lazy(() => import('../views/AdminPages/AllCompositionProduit')));
const AddCompositionsProduit = Loadable(lazy(() => import('../views/AdminPages/AddCompositionProduit')));
const EditCompositionsProduit = Loadable(lazy(() => import('../views/AdminPages/EditCompositionProduit')));
const Commande = Loadable(lazy(() => import('../views/AdminPages/AllCommande')));
const AddCommande = Loadable(lazy(() => import('../views/AdminPages/AddCommande')));
const EditCommande = Loadable(lazy(() => import('../views/AdminPages/EditCommande')));
const Factures = Loadable(lazy(() => import('../views/AdminPages/AllFacture')));
const Addfactures = Loadable(lazy(() => import('../views/AdminPages/AddFacture')));
const Editfactures = Loadable(lazy(() => import('../views/AdminPages/EditFacture')));
const GridTable = Loadable(lazy(() => import('../views/AdminPages/GridTable')));
const AllSuppliers = Loadable(lazy(() => import('../views/AdminPages/AllSupplier')));
const AddSupplier = Loadable(lazy(() => import('../views/AdminPages/AddSupplier')));
const EditSupplier = Loadable(lazy(() => import('../views/AdminPages/EditSupplier')));


/***** Gerent ****/
const DashboardsGerent = Loadable(lazy(() => import('../views/GerantPages/GerantDashboard')));
const ProductsGerent = Loadable(lazy(() => import('../views/GerantPages/AllProduitGerant')));
const EditProductsGerent = Loadable(lazy(() => import('../views/GerantPages/EditProduitGerant')));
const AddProductsGerent = Loadable(lazy(() => import('../views/GerantPages/AddProduitGerant')));
const CategoriesGerent = Loadable(lazy(() => import('../views/GerantPages/AllCategorieGerant')));
const AddCategoriesGerent = Loadable(lazy(() => import('../views/GerantPages/AddCategorieGerant')));
const EditCategoriesGerent = Loadable(lazy(() => import('../views/GerantPages/EditCategorieGerant')));
const IngrédientsGerent = Loadable(lazy(() => import('../views/GerantPages/AllIngredientGerant')));
const AddIngrédientsGerent = Loadable(lazy(() => import('../views/GerantPages/AddIngredientGerant')));
const EditIngrédientsGerent = Loadable(lazy(() => import('../views/GerantPages/EditIngredientGerant')));
const CompositionsProduitGerent = Loadable(lazy(() => import('../views/GerantPages/AllCompositionProduitGerant')));
const AddCompositionsProduitGerent = Loadable(lazy(() => import('../views/GerantPages/AddCompositionProduitGerant')));
const EditCompositionsProduitGerent = Loadable(lazy(() => import('../views/GerantPages/EditCompositionProduitGerant')));
const CommandeGerent = Loadable(lazy(() => import('../views/GerantPages/AllCommandeGerant')));
const AddCommandeGerent = Loadable(lazy(() => import('../views/GerantPages/AddCommandeGerant')));
const EditCommandeGerent = Loadable(lazy(() => import('../views/GerantPages/EditCommandeGerant')));
const FacturesGerent = Loadable(lazy(() => import('../views/GerantPages/AllFactureGerant')));
const AddfacturesGerent = Loadable(lazy(() => import('../views/GerantPages/AddFactureGerant')));
const EditFactureGerant = Loadable(lazy(() => import('../views/GerantPages/EditFactureGerant')));
const AllSuppliersGerant = Loadable(lazy(() => import('../views/GerantPages/AllSupplierGerant')));
const AddSupplierGerant = Loadable(lazy(() => import('../views/GerantPages/AddSupplierGerant')));
const EditSupplierGerant = Loadable(lazy(() => import('../views/GerantPages/EditSupplierGerant')));


/***** Caissier ****/
const AllCommandeCaissier = Loadable(lazy(() => import('../views/CaissierPages/AllCommandeCaissier')));
const DashboardCmdCaissier = Loadable(lazy(() => import('../views/CaissierPages/CaissierDashboard')));
const AddCommandeCaissier = Loadable(lazy(() => import('../views/CaissierPages/AddCommandeCaissier')));

/***** Serveur ****/
const AllCommandeServeur = Loadable(lazy(() => import('../views/ServeurPages/AllCommandeServeur')));
const AddCommandeServeur = Loadable(lazy(() => import('../views/ServeurPages/AddCommandeServeur')));
const ServeurDashboard = Loadable(lazy(() => import('../views/ServeurPages/ServeurDashboard')));
const ProductsServeur = Loadable(lazy(() => import('../views/ServeurPages/AllProduitServeur')));

/***** Cuisinier ****/
const CuisinierDashboard = Loadable(lazy(() => import('../views/CuisinierPages/CuisinierDashboard')));
const AllCommandeCuisinier = Loadable(lazy(() => import('../views/CuisinierPages/AllCommandeCuisinier')));
const AllProduitCuisinier = Loadable(lazy(() => import('../views/CuisinierPages/AllProduitCuisinier')));
const AllIngredientCuisinier = Loadable(lazy(() => import('../views/CuisinierPages/AllIngredientCuisinier')));

/*****Routes******/
const ThemeRoutes = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/', name: 'Login', element: <Navigate to="/Login" /> },
      { path: '/login', name: 'Login', exact: true, element: <Login /> },
      //{ path: '*', element: <Navigate to="/auth/404" /> },

    ],
  },
  {
    path: '/',
    element: <FullLayout />,
    children: [
     //Admin
      { path: '/adminDashboard', name: 'DashboardsAdmin', exact: true, element: <DashboardsAdmin/> },
      { path: '/allUser', name: 'Users', exact: true, element: <Users /> },
      { path: '/editUser/:id', name: 'EditUsers', exact: true, element: <EditUsers /> },
      { path: '/addUser', name: 'AddUsers', exact: true, element: <AddUsers /> },

      { path: '/allProduit', name: 'Products', exact: true, element: <Products /> },
      { path: '/editProduit/:id', name: 'EditProducts', exact: true, element: <EditProducts /> },
      { path: '/addProduit', name: 'AddProducts', exact: true, element: <AddProducts /> },

      { path: '/allCategory', name: 'Categories', exact: true, element: <Categories /> },
      { path: '/addCategory', name: 'AddCategories', exact: true, element: <AddCategories /> },
      { path: '/editCategory/:id', name: 'EditCategories', exact: true, element: <EditCategories /> },
      { path: '/categories/:id/products', name: 'ProductsByCategory', exact: true, element: <ProductsByCategory /> },

      { path: '/allIngredient', name: 'Ingrédients', exact: true, element: <Ingrédients /> },
      { path: '/addIngredient', name: 'AddIngrédients', exact: true, element: <AddIngrédients /> },
      { path: '/editIngredient/:id', name: 'EditIngrédients', exact: true, element: <EditIngrédients /> },

      { path: '/compositions', name: 'CompositionsProduit', exact: true, element: <CompositionsProduit /> },
      { path: '/addCompositionProduit', name: 'AddCompositionsProduit', exact: true, element: <AddCompositionsProduit /> },
      { path: '/editCompositionProduit/:id', name: 'EditCompositionsProduit', exact: true, element: <EditCompositionsProduit /> },

      { path: '/commandes', name: 'Commande', exact: true, element: <Commande /> },
      { path: '/addCommande', name: 'AddCommande', exact: true, element: <AddCommande /> },
      { path: '/editCommande/:id', name: 'EditCommande', exact: true, element: <EditCommande /> },

      { path: '/factures', name: 'Factures', exact: true, element: <Factures /> },
      { path: '/addFacture', name: 'Addfactures', exact: true, element: <Addfactures /> },
      { path: '/editFacture/:id', name: 'Editfactures', exact: true, element: <Editfactures /> },

      { path: '/gridTable', name: 'GridTable', exact: true, element: <GridTable /> },

      { path: '/allSuppliers', name: 'AllSuppliers', exact: true, element: <AllSuppliers /> },
      { path: '/editSupplier/:id', name: 'EditSupplier', exact: true, element: <EditSupplier /> },
      { path: '/addSupplier', name: 'AddSupplier', exact: true, element: <AddSupplier /> },

      //Caissier
      { path: '/caissierDashboard', name: 'DashboardCmdCaissier', exact: true, element: <DashboardCmdCaissier /> },
      { path: '/allCommandeCaissier', name: 'AllCommandeCaissier', exact: true, element: <AllCommandeCaissier /> },
      { path: '/addCommandeCaissier', name: 'AddCommandeCaissier', exact: true, element: <AddCommandeCaissier /> },
      //Serveur
      { path: '/serveurDashboard', name: 'ServeurDashboard', exact: true, element: <ServeurDashboard /> },
      { path: '/allCommandeServeur', name: 'AllCommandeServeur', exact: true, element: <AllCommandeServeur /> },
      { path: '/addCommandeServeur', name: 'AddCommandeServeur', exact: true, element: <AddCommandeServeur /> },
      { path: '/allProduitServeur', name: 'ProductsServeur', exact: true, element: <ProductsServeur /> },
       //Cuisinier
       { path: '/cuisinierDashboard', name: 'CuisinierDashboard', exact: true, element: <CuisinierDashboard /> },
       { path: '/allCommandeCuisinier', name: 'AllCommandeCuisinier', exact: true, element: <AllCommandeCuisinier /> },
       { path: '/allIngredientCuisinier', name: 'AllIngredientCuisinier', exact: true, element: <AllIngredientCuisinier /> },
       { path: '/allProduitCuisinier', name: 'AllProduitCuisinier', exact: true, element: <AllProduitCuisinier /> },

      //Gerent
      
      { path: '/gerantDashboard', name: 'DashboardsGerent', exact: true, element: <DashboardsGerent/> },

      { path: '/allProduitGerent', name: 'ProductsGerentGerent', exact: true, element: <ProductsGerent /> },
      { path: '/editProduitGerent/:id', name: 'EditProductsGerent', exact: true, element: <EditProductsGerent /> },
      { path: '/addProduitGerent', name: 'AddProductsGerent', exact: true, element: <AddProductsGerent /> },

      { path: '/allCategoryGerent', name: 'CategoriesGerent', exact: true, element: <CategoriesGerent /> },
      { path: '/addCategoryGerent', name: 'AddCategoriesGerent', exact: true, element: <AddCategoriesGerent /> },
      { path: '/editCategoryGerent/:id', name: 'EditCategoriesGerent', exact: true, element: <EditCategoriesGerent /> },

      { path: '/allIngredientGerent', name: 'IngrédientsGerent', exact: true, element: <IngrédientsGerent /> },
      { path: '/addIngredientGerent', name: 'AddIngrédientsGerent', exact: true, element: <AddIngrédientsGerent /> },
      { path: '/editIngredientGerent/:id', name: 'EditIngrédientsGerent', exact: true, element: <EditIngrédientsGerent /> },

      { path: '/compositions', name: 'CompositionsProduitGerent', exact: true, element: <CompositionsProduitGerent /> },
      { path: '/addCompositionProduit', name: 'AddCompositionsProduitGerent', exact: true, element: <AddCompositionsProduitGerent /> },
      { path: '/editCompositionProduit/:id', name: 'EditCompositionsProduitGerent', exact: true, element: <EditCompositionsProduitGerent /> },

      { path: '/allCommandeGerant', name: 'CommandeGerent', exact: true, element: <CommandeGerent /> },
      { path: '/addCommandeGerant', name: 'AddCommandeGerent', exact: true, element: <AddCommandeGerent /> },
      { path: '/editCommandeGerant/:id', name: 'EditCommandeGerent', exact: true, element: <EditCommandeGerent /> },

      { path: '/factures', name: 'FacturesGerent', exact: true, element: <FacturesGerent /> },
      { path: '/addFacture', name: 'AddfacturesGerent', exact: true, element: <AddfacturesGerent /> },
      { path: '/editFacture/:id', name: 'EditFactureGerant', exact: true, element: <EditFactureGerant /> },

      { path: '/allSuppliersGerant', name: 'AllSuppliersGerant', exact: true, element: <AllSuppliersGerant /> },
      { path: '/editSupplierGerant/:id', name: 'EditSupplierGerant', exact: true, element: <EditSupplierGerant /> },
      { path: '/addSupplierGerant', name: 'AddSupplierGerant', exact: true, element: <AddSupplierGerant /> },
    ],
  },
  
];

export default ThemeRoutes;
