import React, { useEffect } from "react";
import { Box, Divider, Drawer, List, Typography, makeStyles } from "@material-ui/core";

import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import NavItem from "./NavItem";
import SchoolIcon from "@material-ui/icons/School";
import SubjectIcon from '@material-ui/icons/Subject';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

const user = {
  jobTitle: "Web administrator",
  name: "Administrator",
};

const items = [
  {
    href: "/dashboard",
    icon: HomeIcon,
    title: "Home",
  },
  {
    href: "/students",
    icon: PeopleIcon,
    title: "Students",
  },
  {
    href: "/teachers",
    icon: PersonIcon,
    title: "Teachers",
  },
  {
    href: "/courses",
    icon: SchoolIcon,
    title: "Courses",
  },  
  {
    href: "/lectures",
    icon: SubjectIcon,
    title: "Lectures",
  },
  {
    href: "/attendances",
    icon: PlaylistAddCheckIcon,
    title: "Attendances",
  }
];

const useStyles = makeStyles(() => ({
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
}));

const NavBar = () => {
  const classes = useStyles();

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Drawer anchor="left" classes={{ paper: classes.desktopDrawer }} open variant="persistent">
        {content}
      </Drawer>
    </>
  );
};

export default NavBar;
