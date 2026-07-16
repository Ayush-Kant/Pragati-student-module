import { NavLink } from "react-router-dom";

const SidebarItem = ({ item }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        isActive ? "sidebar-item active" : "sidebar-item"
      }
      style={({ isActive }) => ({
        backgroundColor: isActive ? `${item.color}15` : "transparent",
        borderLeft: isActive
          ? `4px solid ${item.color}`
          : "4px solid transparent",
      })}
    >
      <Icon size={22} color={item.color} />

      <span>{item.name}</span>
    </NavLink>
  );
};

export default SidebarItem;
