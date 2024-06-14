import * as Icon from 'react-feather';
import { FaShoppingCart, FaUser, FaHome, FaClipboardList, FaFileInvoiceDollar, FaTable } from 'react-icons/fa'; // Icône pour les produits
import { MdCategory } from 'react-icons/md'; // Icône pour les catégories
import { GiFruitBowl, GiCook } from 'react-icons/gi'; // Icône pour les ingrédients
import { FaTruck } from 'react-icons/fa';

const iconStyle = {
    fontSize: '26px', // Ajustez la taille selon vos besoins
    color: 'currentColor', // Vous pouvez aussi ajuster la couleur ici
};
const iconStyle2 = {
    fontSize: '19px', // Ajustez la taille selon vos besoins
    color: 'currentColor', // Vous pouvez aussi ajuster la couleur ici
};

const iconStyle3 = {
    fontSize: '30px', // Ajustez la taille selon vos besoins
    color: 'currentColor', // Vous pouvez aussi ajuster la couleur ici
};

const userData = JSON.parse(localStorage.getItem("user"));
console.log(userData);
let SidebarData = [];

if (userData) {
    switch (true) {
        case userData.role[0].role_name === 'admin':
            SidebarData = [
                {
                    title: 'Dashboards',
                    href: '/adminDashboard',
                    id: 1,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaHome style={iconStyle} />,
                    collapsible: true,
                },
                {
                    title: 'Users',
                    href: '/allUser',
                    id: 2,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaUser style={iconStyle} />,
                    collapsible: true,
                },
                {
                    title: 'Products',
                    href: '/allProduit',
                    id: 3,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaShoppingCart style={iconStyle} />,
                    collapsible: true,
                },
                {
                    title: 'Categories',
                    href: '/allCategory',
                    id: 4,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <MdCategory style={iconStyle} />,
                    collapsible: true,
                },
                {
                    title: 'Ingredients',
                    href: '/allIngredient',
                    id: 5,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <GiFruitBowl style={iconStyle} />,
                    collapsible: true,
                },
                {
                    title: 'ProductComposition',
                    href: '/compositions',
                    id: 6,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <GiCook style={iconStyle3} />,
                    collapsible: true,
                },
                {
                    title: 'All Commandes',
                    href: '/commandes',
                    id: 7,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaClipboardList style={iconStyle2} />,
                    collapsible: true,
                },
                {
                    title: 'Facture',
                    href: '/factures',
                    id: 8,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaFileInvoiceDollar style={iconStyle2} />,
                    collapsible: true,
                },
                {
                    title: 'GridTable',
                    href: '/gridTable',
                    id: 9,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaTable style={iconStyle2} />,
                    collapsible: true,
                },
                {
                    title: 'Supplier',
                    href: '/allSuppliers',
                    id: 10,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaTruck style={iconStyle2} />,
                    collapsible: true,
                }
            ];
            break;

            case userData.role[0].role_name === 'caissier':
            SidebarData = [
                {
                    title: 'Dashboards',
                    href: '/caissierDashboard',
                    id: 1,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <Icon.Home />,
                    collapsible: true,
                },
                {
                    title: 'All Commande ',
                    href: '/allCommandeCaissier',
                    id: 2,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <Icon.Box />,
                    collapsible: true,
                },
                // Add other caissier menu items
            ];
            break;

            case userData.role[0].role_name === 'serveur':
            SidebarData = [
                {
                    title: 'Dashboards',
                    href: '/serveurDashboard',
                    id: 1,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <Icon.Home />,
                    collapsible: true,
                },
                {
                    title: 'All Commandes',
                    href: '/AllCommandeServeur',
                    id: 2,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <Icon.Box />,
                    collapsible: true,
                },
                {
                    title: 'Products',
                    href: '/allProduitServeur',
                    id: 3,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaShoppingCart style={iconStyle} />,
                    collapsible: true,
                }
                // Add other serveur menu items
            ];
            break;

            case userData.role[0].role_name === 'cuisinier':
            SidebarData = [
                {
                    title: 'Dashboards',
                    href: '/cuisinierDashboard',
                    id: 1,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <Icon.Home />,
                    collapsible: true,
                },
                {
                    title: 'All Commandes ',
                    href: '/allCommandeCuisinier',
                    id: 2,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <Icon.Box />,
                    collapsible: true,
                },
                {
                    title: 'Produits ',
                    href: '/allProduitCuisinier',
                    id: 2,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <Icon.Box />,
                    collapsible: true,
                },
                {
                    title: 'Ingredients ',
                    href: '/allIngredientCuisinier',
                    id: 2,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <Icon.Box />,
                    collapsible: true,
                },
                // Add other caissier menu items
            ];
            break;


            case userData.role[0].role_name === 'gerant':
            SidebarData = [
                {
                    title: 'Dashboards',
                    href: '/gerantDashboard',
                    id: 1,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaHome style={iconStyle} />,
                    collapsible: true,
                },
                {
                    title: 'Products',
                    href: '/allProduitGerent',
                    id: 2,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaShoppingCart style={iconStyle} />,
                    collapsible: true,
                },
                {
                    title: 'Categories',
                    href: '/allCategoryGerent',
                    id: 3,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <MdCategory style={iconStyle} />,
                    collapsible: true,
                },
                {
                    title: 'Ingredients',
                    href: '/allIngredientGerent',
                    id: 4,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <GiFruitBowl style={iconStyle} />,
                    collapsible: true,
                },
                {
                    title: 'ProductComposition',
                    href: '/compositions',
                    id: 5,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <GiCook style={iconStyle3} />,
                    collapsible: true,
                },
                {
                    title: 'Commandes',
                    href: '/allCommandeGerant',
                    id: 6,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaClipboardList style={iconStyle2} />,
                    collapsible: true,
                },
                {
                    title: 'Facture',
                    href: '/factures',
                    id: 7,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaFileInvoiceDollar style={iconStyle2} />,
                    collapsible: true,
                },
                {
                    title: 'Supplier',
                    href: '/allSuppliersGerant',
                    id: 10,
                    suffixColor: 'bg-cyan rounded-pill text-dark-white',
                    icon: <FaTruck style={iconStyle2} />,
                    collapsible: true,
                }

            ];
            break;
        // Add cases for other roles
        default:
            // If the role is not recognized or defined, leave SidebarData empty
            break;
    }
}

export default SidebarData;
