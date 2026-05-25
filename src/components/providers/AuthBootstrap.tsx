"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetMeQuery } from "@/store/api/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { logout, setCredentials } from "@/store/slices/auth.slice";

export default function AuthBootstrap() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [isChecking, setIsChecking] = useState(true);

  const isAuthPage = pathname === "/login";

  const { data, error, isLoading } = useGetMeQuery(undefined, {
    skip: isAuthPage,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLoading) return;

    if (data) {
      dispatch(setCredentials({ user: data }));
    }

    if (error && "status" in error && error.status === 401) {
      dispatch(logout());
    }

    setIsChecking(false);
  }, [data, error, isLoading, dispatch]);

  if (isChecking && !isAuthPage) {
    return null;
  }

  return null;
}