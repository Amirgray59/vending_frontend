
"use client";

import React, { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuPencilLine, LuSearch, LuUser } from "react-icons/lu";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import StyledPagination from "@/components/ui/Pagination";
import CreateUserModal from "./CreateUserModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import UseGetUserList from "../hooks/useGetUserList";
import { useDeleteUser } from "../hooks/useDeleteUser";
import Skeleton from "react-loading-skeleton";
import UseGetProfile from "@/shared/hooks/useGetProfile";
import {
  hasActionPermission,
  hasMinLevel,
} from "@/shared/permisseions/permissionUtils";
import { PermissionLevel, ROLE_OPTIONS } from "@/shared/permisseions/roles";
import { formatToPersianDate } from "@/utils/formatToPersianDate";

const getRoleLabel = (role: string) => {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
};

const UserTable = () => {
  const { isgettingprofile, profile } = UseGetProfile();

  const [isCreateUser, setIsCreateUser] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  const { userList, isgettigUserList } = UseGetUserList();
  
  const { deleteUser } = useDeleteUser();

  const filteredUsers = useMemo(() => {
    if (!userList?.items) return [];
    return userList.items.filter((user: any) => {
      const matchesSearch =
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        getRoleLabel(user.role)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "" || user.role === roleFilter;
      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = user.is_active === true;
      else if (statusFilter === "unactive")
        matchesStatus = user.is_active === false;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [userList?.items, searchTerm, roleFilter, statusFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, filteredUsers]);

  const totalPages = Math.ceil(filteredUsers.length / (pageSize || 1));

  const handleClickDeleteBtn = (id: string) => {
    setDeleteId(id);
    setIsDelete(true);
  };

  const handleDeleteModal = async () => {
    if (deleteId) {
      if (hasActionPermission(profile?.role, "canDelete")) {
        await deleteUser(deleteId, {
          onSuccess: () => {
            setIsDelete(false);
            setDeleteId(null);
          },
        });
      } else {
        setIsDelete(false);
        setDeleteId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg mt-4 border border-gray-100 shadow-sm p-4">

      <div className="flex items-center justify-center sm:justify-start gap-4 mb-4 ">
        {isgettigUserList ? (
          <Skeleton className=" h-11 " width={110} />
        ) : (
          hasActionPermission(profile?.role, "canCreate") && (
            <button
              onClick={() => setIsCreateUser(true)}
              className="flex items-center justify-center gap-2 bg-[#2563EB] text-white px-5 py-2 rounded-sm text-sm font-medium cursor-pointer shadow-sm transition-all"
            >
              <FaPlus />
              <span>افزودن کاربر</span>
            </button>
          )
        )}
      </div>

      <CreateUserModal
        onClose={() => setIsCreateUser(false)}
        open={isCreateUser}
      />
      <CreateUserModal
        onClose={() => setEditId(undefined)}
        open={Boolean(editId)}
        editId={editId}
      />

      <div className="grid grid-cols-12 gap-x-4 mb-4">
        <div className="col-span-12 sm:col-span-6">
          <div className="flex items-center mb-4 sm:mb-0 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی نام، شماره تماس یا نقش..."
              className="w-full outline-0 border border-gray-200 rounded-sm p-2 placeholder:text-sm pr-10"
            />
            <span className="absolute left-3 text-gray-400">
              <LuSearch />
            </span>
          </div>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm p-2 w-full rounded-sm border border-gray-200 outline-none text-gray-500"
          >
            <option value="">همه نقش‌ها</option>
            {ROLE_OPTIONS.map((item) => (
              <option value={item.value} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm p-2 w-full rounded-sm border border-slate-200 outline-none text-slate-500 transition-all "
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="unactive">غیر فعال</option>
          </select>
        </div>
      </div>

      {isgettigUserList || isgettingprofile ? (
        <Skeleton className="h-64 rounded-lg" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-xl sm:min-w-3xl w-full text-right border-collapse">
            <thead className="text-gray-800 text-sm border-b border-gray-100">
              <tr>
                <th className="py-2 pr-4 font-bold bg-[#F9FAFC] rounded-tr-lg w-40">نام</th>
                <th className="py-2 font-bold bg-[#F9FAFC] text-center ml-4">نقش</th>
                <th className="py-2 font-bold bg-[#F9FAFC] text-center">شماره تماس</th>
                <th className="py-2 font-bold bg-[#F9FAFC] text-center">آخرین ورود</th>
                <th className="py-2 font-bold text-center bg-[#F9FAFC] rounded-tl-lg">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((user: any) => {
                  const isSelf = user.id === profile?.id;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="py-4 flex items-center gap-x-1 pr-2 w-40">
                        <div className="border p-2 rounded-full border-gray-300 ml-2">
                          <LuUser className="text-3xl text-gray-500" />
                        </div>

                        <span className="text-sm font-bold text-gray-800">{user.full_name}</span>
                      </td>
                      <td className="py-4 text-center ml-4">
                        <span className={`px-3 py-1 rounded-sm text-xs font-bold ${user.rColor || "bg-gray-100 text-gray-600"}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="py-4 text-center text-gray-600 font-mono">{user.phone}</td>
                      <td className="py-4 text-center text-gray-400 text-sm">
                        {formatToPersianDate(user?.last_login_at) || " وارد نشده"}
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center gap-x-1 items-center">
                          {hasMinLevel(profile?.role, PermissionLevel.LEVEL_1) ||
                            hasActionPermission(profile?.role, "canEdit") ||
                            hasActionPermission(profile?.role, "canDelete") ? (
                            <>
                              {/* ✅ تغییر در این بخش: بررسی نقش و وضعیت کاربر هدف */}
                              {hasMinLevel(profile?.role, PermissionLevel.LEVEL_1) &&
                                !isSelf && 
                                (user.role === 'location_manager' || user.role === 'operator') && 
                                user.is_active === true && (
                                  <button>
                                    <Link
                                      href={`/roles-users/${user.id}`}
                                      className="cursor-pointer border py-0.5 hover:text-blue-600 border-gray-400 hover:border-blue-600 px-2 rounded-sm text-xs font-medium transition-all"
                                    >
                                      <span>تعریف دسترسی</span>
                                    </Link>
                                  </button>
                                )}

                              {hasActionPermission(profile?.role, "canEdit") && !isSelf && (
                                <button
                                  onClick={() => setEditId(user.id)}
                                  className="p-1 text-gray-400 border border-gray-400 hover:border-blue-600 rounded-sm hover:text-blue-600 transition-all"
                                >
                                  <LuPencilLine />
                                </button>
                              )}

                              {hasActionPermission(profile?.role, "canDelete") && !isSelf && (
                                <button
                                  onClick={() => handleClickDeleteBtn(user.id)}
                                  className="p-1 text-gray-400 border border-gray-400 hover:border-red-500 rounded-sm hover:text-red-500 transition-all"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400">_</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">کاربری یافت نشد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {filteredUsers.length > pageSize && (
        <div className="mt-6">
          <StyledPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </div>
      )}

      <ConfirmModal
        handleConfirm={handleDeleteModal}

        onClose={() => setIsDelete(false)}
        open={isDelete}
        title="حذف کاربر"
      />
    </div>
  );
};

export default UserTable;