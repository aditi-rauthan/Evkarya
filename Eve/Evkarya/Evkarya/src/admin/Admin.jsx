import { List, ListItem, ListItemButton, ListItemIcon, Toolbar, Box, useMediaQuery, CssBaseline, ListItemText } from '@mui/material';
import { useTheme } from '@mui/system';
import React, { useState } from 'react';
import { Route, Routes, useNavigate, useLocation, useParams } from 'react-router-dom';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Drawer } from '@mui/material';

import Transaction from './components/transaction';
import AddPost from './components/addPost';
import Calendar from './components/calendar';
import Customers from './components/customers';
import Orders from './components/orders';
import Posts from './components/posts';
import Reviews from './components/reviews';
import Account from './components/VendorProfile';

const menu = [
  { name: "Posts", path: "posts", icon: <InsertEmoticonIcon /> },
  { name: "Orders", path: "orders", icon: <ListAltIcon /> },
  // { name: "Customers", path: "customers", icon: <PeopleAltIcon /> },
  // { name: "Reviews", path: "reviews", icon: <RateReviewIcon /> },
  // { name: "Transaction", path: "transaction", icon: <CurrencyRupeeIcon /> },
  // { name: "Calendar", path: "calendar", icon: <CalendarMonthIcon /> },
  { name: "Add Post", path: "addPost", icon: <AddIcon /> },
  { name: "Account", path: "account", icon: <AccountCircleIcon />},
];

const Admin = () => {
  const { id: vendorId } = useParams(); // get vendor id from URL
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = (
    <Box
      sx={{
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        pt: 0,
      }}
    >
      <List>
        {menu.map((item) => {
          const fullPath = `/vendor/${vendorId}/${item.path}`; // absolute path
          return (
            <ListItem
              key={item.name}
              disablePadding
              onClick={() => navigate(fullPath)}
              sx={{
                backgroundColor: location.pathname === fullPath ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                borderRadius: 1,
              }}
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText>{'Account'}</ListItemText>
          </ListItemButton>
        </ListItem>
      </List> */}
    </Box>
  );

  return (
    <div>
      <div className="flex h-[100vh] pt-40">
        <CssBaseline />
        <div className="w-[15%] pt-10 h-full border-8 border-r-gray-300 ">
          {drawer}
        </div>
        <div className="w-[88%]">
          <Routes>
            <Route path="addPost" element={<AddPost />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="posts" element={<Posts />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="transaction" element={<Transaction />} />
            <Route path="account" element={<Account />} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;