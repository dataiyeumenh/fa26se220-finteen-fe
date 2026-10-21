import { useEffect, useState } from "react";
import { auth } from "../../../../api/auth.api";
import { useWorkspace } from "../../../../features/workspace/useWorkspace";

const errorMessage = (error, fallback) => error?.message || fallback;

export default function useAdminDashboard() {
  const { actor, loading, authError } = useWorkspace();
  return { actor, loading, error: authError, logout: () => auth.logout() };
}

export function useAdminPlans() {
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [notice, setNotice] = useState(null);
  const load = async () => {
    setLoading(true);
    setNotice(null);
    try {
      setPlans(
        Object.fromEntries(
          ((await auth.listPlans()) || []).map((plan) => [plan.kind, plan]),
        ),
      );
    } catch (error) {
      setNotice({
        type: "error",
        text: errorMessage(error, "Không tải được bảng giá."),
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);
  const save = async (kind, price, months) => {
    setSaving(kind);
    setNotice(null);
    try {
      const result = await auth.setPlanPrice(kind, price, months);
      setPlans((current) => ({ ...current, [kind]: result }));
      setNotice({
        type: "success",
        text: `Đã cập nhật gói ${kind}. Bảng giá công khai có hiệu lực ngay.`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: errorMessage(error, "Không cập nhật được bảng giá."),
      });
    } finally {
      setSaving("");
    }
  };
  return { plans, loading, saving, notice, load, save };
}

export function useAdminTransactions(status, page, size = 20) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState("");
  const [notice, setNotice] = useState(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  useEffect(() => {
    auth
      .listAdminTransactions({ status, page, size })
      .then((result) => {
        setRows(result || []);
        setNotice(null);
      })
      .catch((error) =>
        setNotice({
          type: "error",
          text: errorMessage(error, "Không tải được giao dịch."),
        }),
      )
      .finally(() => setLoading(false));
  }, [page, refreshVersion, size, status]);
  const reconcile = async (orderCode) => {
    setReconciling(String(orderCode));
    setNotice(null);
    try {
      const result = await auth.reconcileTransaction(orderCode);
      setRows((current) =>
        current.map((row) =>
          String(row.orderCode) === String(orderCode)
            ? { ...row, ...result }
            : row,
        ),
      );
      setNotice({
        type: "success",
        text: `Đã đối soát đơn ${orderCode}: ${result.status}.`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: errorMessage(error, "Không đối soát được giao dịch."),
      });
    } finally {
      setReconciling("");
    }
  };
  return {
    rows,
    loading,
    reconciling,
    notice,
    reload: () => {
      setLoading(true);
      setRefreshVersion((value) => value + 1);
    },
    reconcile,
  };
}

export function useAdminAccountSearch(onFound) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const search = async (email) => {
    setLoading(true);
    setError("");
    onFound(null);
    try {
      onFound(await auth.findAdminAccount(email));
    } catch (searchError) {
      setError(
        errorMessage(searchError, "Không tìm thấy tài khoản với email này."),
      );
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, search };
}

export function useAdminRoleAccounts(reloadKey) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  useEffect(() => {
    auth
      .listAdminRoles()
      .then((list) => {
        setRows(Array.isArray(list) ? list : []);
        setError("");
      })
      .catch((loadError) =>
        setError(
          errorMessage(loadError, "Không tải được danh sách tài khoản nội bộ."),
        ),
      )
      .finally(() => setLoading(false));
  }, [reloadKey, refreshVersion]);
  return {
    rows,
    loading,
    error,
    reload: () => {
      setLoading(true);
      setRefreshVersion((value) => value + 1);
    },
  };
}

export function useAdminRoles() {
  const [account, setAccount] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [listVersion, setListVersion] = useState(0);
  const chooseAccount = (value) => {
    setAccount(value);
    setNotice(null);
  };
  const changeRole = async ({ action, role, reason }) => {
    if (!account) return false;
    setBusy(true);
    setNotice(null);
    try {
      const method =
        action === "grant" ? auth.grantAdminRole : auth.revokeAdminRole;
      const result = await method({ subjectId: account.id, role, reason });
      setAccount((current) => ({ ...current, roles: result.roles || [] }));
      setListVersion((version) => version + 1);
      setNotice({
        type: "success",
        text: `${action === "grant" ? "Đã cấp" : "Đã thu hồi"} vai trò ${role} cho ${account.email}.`,
      });
      return true;
    } catch (error) {
      setNotice({
        type: "error",
        text: errorMessage(error, "Không thay đổi được vai trò."),
      });
      return false;
    } finally {
      setBusy(false);
    }
  };
  return {
    account,
    busy,
    notice,
    listVersion,
    chooseAccount,
    changeRole,
    setNotice,
  };
}

export function useAdminRoleLogs(appliedSubjectId, page, size = 50) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  useEffect(() => {
    auth
      .listAdminRoleLogs({ subjectId: appliedSubjectId, page, size })
      .then((list) => {
        setRows(Array.isArray(list) ? list : []);
        setError("");
      })
      .catch((loadError) => {
        setRows([]);
        setError(errorMessage(loadError, "Không tải được nhật ký phân quyền."));
      })
      .finally(() => setLoading(false));
  }, [appliedSubjectId, page, refreshVersion, size]);
  return {
    rows,
    loading,
    error,
    startLoading: () => setLoading(true),
    reload: () => {
      setLoading(true);
      setRefreshVersion((value) => value + 1);
    },
  };
}

export function useAdminEntitlement() {
  const [account, setAccount] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const chooseAccount = (value) => {
    setAccount(value);
    setNotice(null);
  };
  const grant = async ({ kind, months, reason }) => {
    if (!account) return false;
    setBusy(true);
    setNotice(null);
    try {
      await auth.grantEntitlement({
        accountId: account.id,
        kind,
        months,
        reason,
      });
      setNotice({
        type: "success",
        text: `Đã cấp gói ${kind} cho ${account.email}.`,
      });
      return true;
    } catch (error) {
      setNotice({
        type: "error",
        text: errorMessage(error, "Không cấp được gói."),
      });
      return false;
    } finally {
      setBusy(false);
    }
  };
  return { account, busy, notice, chooseAccount, grant };
}
