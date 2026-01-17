"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useGetSchoolByIdQuery,
} from "@/services/master/school.service";
import type { School } from "@/types/master/school";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "@/components/ui/combo-box";

import { useGetProvinsiListQuery } from "@/services/master/provinsi.service";
import { useGetKotaListQuery } from "@/services/master/kota.service";
import { useGetKecamatanListQuery } from "@/services/master/kecamatan.service";
import { useGetKelurahanListQuery } from "@/services/master/kelurahan.service";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
  schoolId?: number | null; // jika ada → edit mode
};

// Sekaligus include field wilayah, diasumsikan nullable di tipe School
type SchoolUpsert = Pick<
  School,
  | "name"
  | "description"
  | "status"
  | "province_id"
  | "regency_id"
  | "district_id"
  | "village_id"
>;

type RegionOption = {
  id: number | string;
  name: string;
};

export default function SchoolForm({
  open,
  onOpenChange,
  onSuccess,
  schoolId,
}: Props) {
  const isEdit = typeof schoolId === "number";

  const [form, setForm] = useState<SchoolUpsert>({
    name: "",
    description: "",
    status: true,
    province_id: null,
    regency_id: null,
    district_id: null,
    village_id: null,
  });

  const { data: detail, isFetching } = useGetSchoolByIdQuery(schoolId ?? 0, {
    skip: !isEdit,
  });

  // ====== STATE SEARCH COMBOBOX WILAYAH ======
  const [provinceSearch, setProvinceSearch] = useState("");
  const [regencySearch, setRegencySearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [villageSearch, setVillageSearch] = useState("");

  // ====== QUERY WILAYAH (ID dikirim sebagai string) ======
  const {
    data: provResp,
    isLoading: loadingProv,
    refetch: refetchProv,
  } = useGetProvinsiListQuery(
    { page: 1, paginate: 100, search: provinceSearch || "" },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: kotaResp,
    isLoading: loadingKota,
    refetch: refetchKota,
  } = useGetKotaListQuery(
    {
      page: 1,
      paginate: 100,
      search: regencySearch || "",
      province_id: form.province_id ?? undefined,
    },
    { skip: !form.province_id, refetchOnMountOrArgChange: true }
  );

  const {
    data: kecResp,
    isLoading: loadingKec,
    refetch: refetchKec,
  } = useGetKecamatanListQuery(
    {
      page: 1,
      paginate: 100,
      search: districtSearch || "",
      regency_id: form.regency_id ?? undefined,
    },
    { skip: !form.regency_id, refetchOnMountOrArgChange: true }
  );

  const {
    data: kelResp,
    isLoading: loadingKel,
    refetch: refetchKel,
  } = useGetKelurahanListQuery(
    {
      page: 1,
      paginate: 100,
      search: villageSearch || "",
      district_id: form.district_id ?? undefined,
    },
    { skip: !form.district_id, refetchOnMountOrArgChange: true }
  );

  const provinces: RegionOption[] = provResp?.data ?? [];
  const regencies: RegionOption[] = kotaResp?.data ?? [];
  const districts: RegionOption[] = kecResp?.data ?? [];
  const villages: RegionOption[] = kelResp?.data ?? [];

  // ====== PREFILL SAAT EDIT / RESET SAAT CREATE ======
  useEffect(() => {
    if (detail && isEdit) {
      setForm({
        name: detail.name,
        description: detail.description,
        status: detail.status,
        province_id: detail.province_id ?? null,
        regency_id: detail.regency_id ?? null,
        district_id: detail.district_id ?? null,
        village_id: detail.village_id ?? null,
      });
    } else if (!isEdit) {
      setForm({
        name: "",
        description: "",
        status: true,
        province_id: null,
        regency_id: null,
        district_id: null,
        village_id: null,
      });
      setProvinceSearch("");
      setRegencySearch("");
      setDistrictSearch("");
      setVillageSearch("");
    }
  }, [detail, isEdit, open]);

  const [createSchool, { isLoading: creating }] = useCreateSchoolMutation();
  const [updateSchool, { isLoading: updating }] = useUpdateSchoolMutation();

  const update = <K extends keyof SchoolUpsert>(k: K, v: SchoolUpsert[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  // Helper: nilai numeric untuk Combobox (state internal combobox pakai number|null)
  const provinceValue = useMemo(
    () => (form.province_id ? Number(form.province_id) : null),
    [form.province_id]
  );
  const regencyValue = useMemo(
    () => (form.regency_id ? Number(form.regency_id) : null),
    [form.regency_id]
  );
  const districtValue = useMemo(
    () => (form.district_id ? Number(form.district_id) : null),
    [form.district_id]
  );
  const villageValue = useMemo(
    () => (form.village_id ? Number(form.village_id) : null),
    [form.village_id]
  );

  const handleSubmit = async () => {
    const payload: SchoolUpsert = {
      name: form.name,
      description: form.description,
      status: form.status,
      province_id: form.province_id,
      regency_id: form.regency_id,
      district_id: form.district_id,
      village_id: form.village_id,
    };

    if (isEdit && schoolId != null) {
      await updateSchool({ id: schoolId, payload }).unwrap();
    } else {
      await createSchool(payload).unwrap();
    }
    onSuccess?.();
  };

  return (
    // ⬇️ Pakai overlay bawaan Dialog (jangan modal={false} & overlay custom)
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl xl:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Sekolah" : "Tambah Sekolah"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Nama *</Label>
            <Input
              placeholder="Nama Sekolah"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              disabled={isFetching}
            />
          </div>

          <div className="grid gap-2">
            <Label>Deskripsi</Label>
            <Textarea
              placeholder="Deskripsi singkat (opsional)"
              value={form.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              disabled={isFetching}
            />
          </div>

          {/* ====== FIELD WILAYAH (nullable & cascade) ====== */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Provinsi</Label>
              <Combobox<RegionOption>
                value={provinceValue}
                onChange={(v) => {
                  update("province_id", String(v));
                  update("regency_id", null);
                  update("district_id", null);
                  update("village_id", null);
                }}
                onSearchChange={setProvinceSearch}
                onOpenRefetch={() => refetchProv()}
                data={provinces}
                isLoading={loadingProv}
                placeholder="Pilih Provinsi (opsional)"
                getOptionLabel={(item) => item.name}
              />
            </div>

            <div className="grid gap-2">
              <Label>Kota / Kabupaten</Label>
              <Combobox<RegionOption>
                value={regencyValue}
                onChange={(v) => {
                  update("regency_id", String(v));
                  update("district_id", null);
                  update("village_id", null);
                }}
                onSearchChange={setRegencySearch}
                onOpenRefetch={() => {
                  if (form.province_id) refetchKota();
                }}
                data={regencies}
                isLoading={loadingKota}
                placeholder={
                  form.province_id
                    ? "Pilih Kota/Kabupaten (opsional)"
                    : "Pilih Provinsi dulu"
                }
                getOptionLabel={(item) => item.name}
              />
            </div>

            <div className="grid gap-2">
              <Label>Kecamatan</Label>
              <Combobox<RegionOption>
                value={districtValue}
                onChange={(v) => {
                  update("district_id", String(v));
                  update("village_id", null);
                }}
                onSearchChange={setDistrictSearch}
                onOpenRefetch={() => {
                  if (form.regency_id) refetchKec();
                }}
                data={districts}
                isLoading={loadingKec}
                placeholder={
                  form.regency_id
                    ? "Pilih Kecamatan (opsional)"
                    : "Pilih Kota/Kabupaten dulu"
                }
                getOptionLabel={(item) => item.name}
              />
            </div>

            <div className="grid gap-2">
              <Label>Kelurahan</Label>
              <Combobox<RegionOption>
                value={villageValue}
                onChange={(v) => {
                  update("village_id", String(v));
                }}
                onSearchChange={setVillageSearch}
                onOpenRefetch={() => {
                  if (form.district_id) refetchKel();
                }}
                data={villages}
                isLoading={loadingKel}
                placeholder={
                  form.district_id
                    ? "Pilih Kelurahan (opsional)"
                    : "Pilih Kecamatan dulu"
                }
                getOptionLabel={(item) => item.name}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.status}
              onCheckedChange={(v) => update("status", v)}
              disabled={isFetching}
            />
            <Label>Status aktif</Label>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={creating || updating || isFetching}
          >
            {creating || updating ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}