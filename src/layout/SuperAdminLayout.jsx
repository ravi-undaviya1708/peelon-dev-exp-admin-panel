import { AppShell, Burger, Input, Menu, ScrollArea } from "@mantine/core";
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Box, Typography } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LuArrowLeftToLine } from "react-icons/lu";
import { MdOutlineMenu } from "react-icons/md";
import { Suspense, useEffect, useState } from "react";
import {
  Activity,
  Bell,
  BookOpen,
  Boxes,
  Calculator,
  CircleCheck,
  CirclePower,
  CircleUserRound,
  Codesandbox,
  FileText,
  Handshake,
  LayoutDashboard,
  Magnet,
  NotebookIcon,
  Package,
  Pencil,
  PersonStanding,
  Truck,
  UserRound,
  Warehouse,
} from "lucide-react";
import logo from "../../src/assets/yellowlogo.png";
import greenlogo from "../../src/assets/logo.png";

import { useDispatch, useSelector } from "react-redux";
import { logoutAuth } from "../redux/features/auth/authSlice";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../constants/pathConstants";
import headerbg from "../assets/headerbg.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiUserAddLine } from "react-icons/ri";
import { CiLock } from "react-icons/ci";
import { PrimaryButton } from "../components/StyledButtons";
import RaiseTicketModal from "./Modal/RaiseTicketModal";
// import { resetLoader } from "../redux/features/loader/loaderSlice";

const SuperAdminLayout = () => {
  const userType = useSelector((state) => state.auth.userType);
  // console.log(userType,"usertype");

  const [isCollapsed, { toggle: toggleCollapse }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [from, setFrom] = useState({
    modal: "",
    TicketId: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const refetchRaisedTicket = () => {
    window.dispatchEvent(new Event("refetch-raised-tickets"));
  };

  const handleLogout = () => {
    localStorage.removeItem("selecteClosedTab");
    localStorage.removeItem("selecteActivitesTab");
    localStorage.removeItem("selectedContactTab");
    localStorage.removeItem("selectedInvoice");
    localStorage.removeItem("selectedProductTab");
    localStorage.removeItem("selectedDelivery&DispatchTab");
    localStorage.removeItem("selectedWareHouseTab");
    localStorage.removeItem("selecteOpenTab");
    localStorage.removeItem("selectedLeadsRaiseTicketTab");
    localStorage.removeItem("orderStatus");

    dispatch(logoutAuth());
    // dispatch(resetLoader());
    navigate("/logout");
  };

  const pathConstantsByRole = {
    "Super Admin": superAdminPathConstants,
    "Factory Operation": factoryPathConstants,
    "Sales Representative": salesRepresentativePathConstants,
    "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    Accounts: accountsPathConstants,
    Customer: customerPathConstants,
  };

  const access = [
    "Accounts",
    "Delivery & Dispatch",
    "Warehouse Manager",
  ].includes(userType);

  const pathConstants = pathConstantsByRole[userType];
  // console.log(pathConstants,"pconstants");

  const { DEFAULT, EDITPROFILE } = pathConstants;
  const handleEditProfile = () => {
    navigate(`${DEFAULT}/${EDITPROFILE}`);
  };

  const Navcontent = [
    {
      headings: "",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          pathconstants: pathConstants.DASHBOARD,
        },
      ],
    },
    ...(userType === "Factory Operation"
      ? [
          {
            heading: "Sales & CRM",
            items: [
              {
                name: "Activities",
                icon: Activity,
                pathconstants: pathConstants.ACTIVITIES,
              },
            ],
          },
        ]
      : []),

    ...(userType !== "Factory Operation"
      ? [
          {
            heading: "Sales & CRM",
            items: [
              {
                name: "Leads",
                icon: Magnet,
                pathconstants: pathConstants.LEADS,
              },
              {
                name: "Deals",
                icon: Handshake,
                pathconstants: pathConstants.DEALS,
              },
              {
                name: "Activities",
                icon: Activity,
                pathconstants: pathConstants.ACTIVITIES,
              },
              {
                name: "Contacts",
                icon: NotebookIcon,
                pathconstants: pathConstants.CONTACTS,
              },
              {
                name: "Calculate Pricing",
                icon: Calculator,
                pathconstants: pathConstants.PRICE,
              },
            ],
          },
        ]
      : []),

    {
      heading: "Order Management",
      items: [
        {
          name: "Orders",
          icon: Package,
          pathconstants: pathConstants.ORDERS,
        },
        {
          name: "Invoice, PO, & Quote",
          icon: FileText,
          pathconstants: pathConstants.INVOICEPOANDQUOTE,
        },
      ],
    },

    ...(userType !== "Factory Operation"
      ? [
          {
            heading: "Customer Management",
            items: [
              {
                name: "Customers",
                icon: PersonStanding,
                pathconstants: pathConstants.CUSTOMER,
              },
              {
                name: "Bulk Order Requests",
                icon: Boxes,
                pathconstants: pathConstants.BULK,
              },
            ],
          },
        ]
      : []),
    {
      heading: "Products & inventory",
      items: [
        ...(userType === "Super Admin"
          ? [
              {
                name: "Blogs",
                icon: BookOpen,
                pathconstants: pathConstants.BLOGS,
              },
            ]
          : []),

        ...(userType !== "Warehouse Manager"
          ? [
              {
                name: "Products & Inventory",
                icon: Codesandbox,
                pathconstants: pathConstants.PRODUCTANDINVENTORY,
              },
            ]
          : []),

        ...(userType !== "Warehouse Manager"
          ? [
              {
                name: "Dispatch & Delivery",
                icon: Truck,
                pathconstants: pathConstants.DELIVERIESANDDISPATCH,
              },
            ]
          : []),

        ...(userType !== "Sales Representative" &&
        userType !== "Warehouse Manager"
          ? [
              {
                name: "Quality Control",
                icon: CircleCheck,
                pathconstants: pathConstants.QUALITYCONTROL,
              },
            ]
          : []),
        {
          name: "Ware House Management",
          icon: Warehouse,
          pathconstants: pathConstants.WAREHOUSE,
        },
      ],
    },

    ...(userType !== "Factory Operation"
      ? [
          {
            heading: "Account & Finance ",
            items: [
              {
                name: "Accounts",
                icon: UserRound,
                pathconstants: pathConstants.ACCOUNTS,
              },
            ],
          },
        ]
      : []),
  ];

  const [mobileOpened, setMobileOpened] = useState(false);

  const toggleMobile = () => setMobileOpened((prev) => !prev);
  const closeMobile = () => setMobileOpened(false);

  const [openMenus, setOpenMenus] = useState({});

  const handleToggle = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const Mobile = useMediaQuery("(max-width:1199px)");
  const isMobile = useMediaQuery("(max-width:1199px)");

  useEffect(() => {
    if (!isMobile && mobileOpened) {
      closeMobile();
    }
  }, [isMobile, mobileOpened, closeMobile]);

  return (
    <>
      <AppShell
        header={{ height: 80 }}
        navbar={{
          width: isCollapsed ? 70 : 240,
          breakpoint: "lg",
          collapsed: { mobile: false, desktop: false },
        }}
        style={{ height: "100vh", overflow: "scroll" }}
      >
        <AppShell.Header
          style={{
            alignContent: "center",
            paddingLeft: "30px",
            paddingRight: "20px",
            backgroundImage: `url(${headerbg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            border: "none",
            width: "100%",
          }}
        >
          <Box
            alignContent={"center"}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {Mobile && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box display={"flex"}>
                  <Box>
                    <Button
                      onClick={() => toggleMobile()}
                      style={{
                        backgroundColor: "transparent",
                        marginBottom: "8px",
                      }}
                    >
                      <MdOutlineMenu size={30} color="white" />
                    </Button>
                  </Box>
                  <Box>
                    <img src={logo} />
                  </Box>
                </Box>

                <Box display={"flex"} gap={1}>
                  {userType === "Super Admin" && (
                    <Box>
                      <PrimaryButton
                        onClick={() => {
                          (open(), setFrom({ modal: "addTicket" }));
                        }}
                      >
                        Raise Ticket
                      </PrimaryButton>
                    </Box>
                  )}
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <Button
                        variant="subtle"
                        styles={{
                          root: {
                            backgroundColor: "transparent",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          },
                        }}
                      >
                        <BsThreeDotsVertical color="white" fontSize={20} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<RiUserAddLine size={16} />}
                        onClick={() => handleEditProfile()}
                      >
                        My Profile
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<CiLock size={16} />}
                        onClick={() => handleLogout()}
                      >
                        Logout
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>{" "}
                </Box>
              </Box>
            )}
          </Box>
          <Box display={"flex"} justifyContent={"space-between"} w="100%">
            <Box display={"flex"} gap={5} alignContent={"center"}>
              <Box
                sx={{
                  display: {
                    xl: "block",
                    lg: "block",
                    md: "none",
                    sm: "none",
                    xs: "none",
                  },
                }}
              >
                <img src={logo} width="100%" height="60px" alt="crmslogo" />
              </Box>
              <Box
                sx={{
                  alignContent: "center",
                  display: {
                    xl: "block",
                    lg: "block",
                    md: "none",
                    sm: "none",
                    xs: "none",
                  },
                }}
              >
                <Button
                  onClick={() => {
                    isMobile ? toggleMobile() : toggleCollapse();
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                  }}
                >
                  <LuArrowLeftToLine
                    color={
                      isMobile
                        ? mobileOpened
                          ? "#000"
                          : "white"
                        : !isCollapsed
                          ? "yellow"
                          : "white"
                    }
                    style={{
                      transform: isMobile
                        ? mobileOpened
                          ? "rotate(180deg)"
                          : "none"
                        : !isCollapsed
                          ? "rotate(180deg)"
                          : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </Button>
              </Box>
            </Box>
            {/* </Box> */}
            <Box
              alignItems={"center"}
              display={{
                xl: "flex",
                lg: "flex",
                md: "none",
                sm: "none",
                xs: "none",
              }}
              gap={2}
            >
              {/* <Input
              placeholder="Search"
              styles={{
                input: {
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "#f6f6f6",
                  },
                },
              }}
              size="md"
            /> */}
              {/* <Box>
              <Bell color="white" cursor="pointer" />
            </Box> */}

              <Box display={"flex"} gap={1}>
                {userType === "Super Admin" && (
                  <Box>
                    <PrimaryButton
                      onClick={() => {
                        (open(), setFrom({ from: "addTicket" }));
                      }}
                    >
                      Raise Ticket
                    </PrimaryButton>
                  </Box>
                )}
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      styles={{
                        root: {
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        },
                      }}
                    >
                      <CircleUserRound color="white" fontSize={20} />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<RiUserAddLine size={16} />}
                      onClick={() => handleEditProfile()}
                    >
                      My Profile
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<CiLock size={16} />}
                      onClick={() => handleLogout()}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>{" "}
              </Box>
              {/* <Box>
              <CirclePower
                color="white"
                onClick={() => handleLogout()}
                cursor="pointer"
              />
            </Box> */}
            </Box>
          </Box>

          <Box
            sx={{
              display: {
                sm: "flex",
                xs: "flex",
                md: "none",
                lg: "none",
                xl: "none",
              },
              justifyContent: "space-between",
            }}
          ></Box>
        </AppShell.Header>
        {!isMobile && (
          <AppShell.Navbar
            style={{
              backgroundColor: "white",
              transition: "all 0.4s ease-in-out",
              borderRight: "1px solid #E3E1E1",
              border: "none",
              paddingLeft: "12px",
            }}
            withBorder={false}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              {Navcontent.map((section, sectionIndex) => (
                <Box key={sectionIndex} sx={{ width: "100%" }}>
                  {!isCollapsed && section?.heading && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="caption"
                        sx={{
                          pt: 1,
                          fontWeight: 600,
                          color: "#333333",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {section.heading}
                      </Typography>
                      <Box
                        sx={{
                          mt: 1,
                          flexGrow: 1,
                          borderBottom: "1px dotted #999",
                          height: "1px",
                        }}
                      />{" "}
                    </Box>
                  )}

                  <List sx={{ width: "100%", padding: 0 }}>
                    {section.items.map((content, index) => {
                      const Icon = content.icon;
                      const isActive = location.pathname.startsWith(
                        `${DEFAULT}/${content.pathconstants}`,
                      ); // Updated logic
                      const hasChildren = content.children?.length > 0;

                      return (
                        <ListItem key={index} disablePadding>
                          <Link
                            to={content.pathconstants}
                            style={{
                              width: "100%",
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            <ListItemButton
                              onClick={() => {
                                if (hasChildren) {
                                  handleToggle(content.name);
                                } else {
                                  navigate(content.pathconstants);
                                }
                              }}
                              sx={{
                                padding: isCollapsed ? "8px" : "8px 10px",
                                justifyContent: isCollapsed
                                  ? "center"
                                  : "flex-start",
                                color: isActive ? "white" : "#666666",
                                backgroundColor: isActive
                                  ? "#23A75B"
                                  : "transparent",
                                marginTop: isCollapsed ? "14px" : "9px",
                                borderRadius: "2px",
                                "&:hover": {
                                  background: isActive ? "#23A75B" : "#b0d9b6",
                                  color: isActive ? "white" : "#153A1A",
                                  "& .MuiListItemIcon-root": {
                                    color: isActive ? "white" : "#FF0000",
                                    "& svg, & .MuiIcon-root": {
                                      color: isActive ? "white" : "#153A1A",
                                    },
                                  },
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  color: isActive ? "white" : "#666666",
                                  backgroundColor: "transparent",
                                  minWidth: 5,
                                  mr: isCollapsed ? 0 : 1,
                                }}
                              >
                                <Icon size={20} />
                              </ListItemIcon>
                              {!isCollapsed && (
                                <>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: isActive ? "white" : "#666666",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {content.name}
                                  </Typography>
                                </>
                              )}
                            </ListItemButton>
                            {hasChildren &&
                              openMenus[content.name] &&
                              !isCollapsed && (
                                <List
                                  component="div"
                                  disablePadding
                                  sx={{ pl: 4 }}
                                >
                                  {content.children.map((child, i) => {
                                    const isChildActive =
                                      location.pathname === child.path;
                                    return (
                                      <ListItem key={i} disablePadding>
                                        <Link
                                          to={child.path}
                                          style={{
                                            width: "100%",
                                            textDecoration: "none",
                                            color: "inherit",
                                          }}
                                        >
                                          <ListItemButton
                                            sx={{
                                              color: isChildActive
                                                ? "#6A57B1"
                                                : "#525E70",
                                              backgroundColor: isChildActive
                                                ? "#FFCD51"
                                                : "transparent",
                                              borderRadius: "6px",
                                              "&:hover": {
                                                backgroundColor: "#F6F6F6",
                                              },
                                            }}
                                          >
                                            <ListItemText
                                              primary={child.name}
                                            />
                                          </ListItemButton>
                                        </Link>
                                      </ListItem>
                                    );
                                  })}
                                </List>
                              )}
                          </Link>
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              ))}
            </div>
          </AppShell.Navbar>
        )}
        <Drawer
          anchor="left"
          open={mobileOpened}
          onClose={closeMobile}
          PaperProps={{
            sx: {
              width: 280,
              display: "flex",
              flexDirection: "column",
              px: 2,
              py: 2,
              scrollbarWidth: "none",
            },
          }}
        >
          {/* Scrollable container */}
          <Box
            sx={{
              height: "100%",
              overflowY: "scroll",
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={2}>
              <img
                src={greenlogo}
                height="50px"
                width="60%"
                style={{ marginBottom: "20px" }}
              />
              <Burger
                opened={isMobile ? mobileOpened : !isCollapsed}
                onClick={isMobile ? toggleMobile : toggleCollapse}
                size="sm"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {Navcontent.map((section, sectionIndex) => (
                <Box key={sectionIndex} sx={{ width: "100%" }}>
                  {section?.heading && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="caption"
                        sx={{
                          pt: 1,
                          fontWeight: 600,
                          color: "#333333",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {section.heading}
                      </Typography>
                      <Box
                        sx={{
                          mt: 1,
                          flexGrow: 1,
                          borderBottom: "1px dotted #999",
                          height: "1px",
                        }}
                      />
                    </Box>
                  )}

                  {section.items.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(
                      `${DEFAULT}/${item.pathconstants}`,
                    );
                    return (
                      <Link
                        to={item.pathconstants || "#"}
                        key={index}
                        onClick={() => {
                          if (mobileOpened) closeMobile();
                        }}
                        style={{
                          width: "100%",
                          textDecoration: "none",
                          display: "block",
                        }}
                      >
                        <Box width="100%" sx={{ justifyContent: "flex-start" }}>
                          <Box
                            p={1}
                            sx={{
                              color: isActive ? "#12A14F" : "#525E70",
                              background: isActive ? "#23A75B" : "white",
                            }}
                          >
                            <Box
                              display="flex"
                              gap={1}
                              sx={{ alignItems: "center" }}
                            >
                              <Icon
                                color={isActive ? "white" : "#666666"}
                                size={"18px"}
                              />
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  color: isActive ? "white" : "#666666",
                                  fontSize: "14px",
                                }}
                              >
                                {item.name}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Link>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Drawer>

        <AppShell.Main style={{ height: "100vh" }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              borderTop: "2px solid #eaeaea",
              borderLeft: "2px solid #eaeaea",
              px: 3,
              py: 4,
              backgroundColor: "#F5F5F5",
              "&::-webkit-scrollbar": {
                width: "7px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#E0E0E0", // Track color
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888888", // Scrollbar handle color
                borderRadius: "4px",
              },
            }}
          >
            <Outlet />
          </Box>
        </AppShell.Main>
      </AppShell>

      {opened && (
        <Suspense fallback={null}>
          <RaiseTicketModal
            opened={opened}
            from={from}
            onClose={close}
            setFrom={setFrom}
            refetchRaisedTicket={refetchRaisedTicket}
          />
        </Suspense>
      )}
    </>
  );
};
export default SuperAdminLayout;
