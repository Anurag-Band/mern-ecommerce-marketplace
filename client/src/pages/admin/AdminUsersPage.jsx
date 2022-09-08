import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllUsers } from "../../features/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const AdminUsersPage = () => {
  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.auth.allUsers);

  const rows = [];

  allUsers &&
    allUsers.length > 0 &&
    allUsers.forEach((user) =>
      rows.push({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      })
    );

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 50,
      flex: 0.2,
      headerClassName: "admin-dashboard-header",
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 100,
      flex: 0.3,
      headerClassName: "admin-dashboard-header",
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 100,
      flex: 0.2,
      headerClassName: "admin-dashboard-header",
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 100,
      flex: 0.1,
      cellClassName: (params) =>
        params.row.role === "admin" ? "outOfStock" : "",
      headerClassName: "admin-dashboard-header",
    },
    {
      field: "actions",
      flex: 0.1,
      headerClassName: "admin-dashboard-header",
      headerName: "Actions",
      minWidth: 100,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="space-x-3">
            <button type="button" onClick={() => {}}>
              <EditIcon />
            </button>
            <button type="button" onClick={() => {}}>
              <DeleteForeverIcon />
            </button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(adminGetAllUsers())
      .then(unwrapResult)
      .then((obj) => {
        console.log({ adminAllUsersThen: obj });
      })
      .catch((obj) => console.log({ adminAllUsersCatch: obj }));
  }, [dispatch]);

  return (
    <main className="w-full h-full flex flex-col">
      <h2 className="text-2xl lg:text-4xl flex justify-center items-center pb-5 font-semibold text-slate-600 h-[10vh]">
        All Users
      </h2>
      <div className="h-[80vh] bg-white">
        <DataGrid
          rows={rows}
          columns={columns}
          getCellClassName={(params) =>
            params.row.role === "admin" ? "pri-cell" : "sec-cell"
          }
        />
      </div>
    </main>
  );
};

export default AdminUsersPage;
