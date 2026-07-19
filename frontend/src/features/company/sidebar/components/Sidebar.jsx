import "./../styles/sidebar.css";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./sidebarData";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.name}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;