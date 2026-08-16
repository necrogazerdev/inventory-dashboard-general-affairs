import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonInput from "components/ArgonInput";
import ArgonTypography from "components/ArgonTypography";

import { useGAInventory } from "context/ga-inventory";
import PageShell from "domains/shared/PageShell";

const emptyForm = { name: "", contactPerson: "", phone: "", address: "", notes: "" };

function VendorFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { vendors, addVendor, updateVendor } = useGAInventory();
  const isEdit = Boolean(id);
  const vendor = vendors.find((entry) => entry.id === id);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && vendor) setForm({ name: vendor.name, contactPerson: vendor.contactPerson || "", phone: vendor.phone || "", address: vendor.address || "", notes: vendor.notes || "" });
  }, [isEdit, vendor]);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const label = (text) => <ArgonTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.75}>{text}</ArgonTypography>;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Vendor name wajib diisi.");
    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (isEdit && vendor) {
      updateVendor(vendor.id, payload);
      navigate(`/vendors/${vendor.id}`);
    } else {
      const created = addVendor(payload);
      navigate(`/vendors/${created.id}`);
    }
  };

  if (isEdit && !vendor) return <PageShell title="Edit Vendor" description="Vendor tidak ditemukan."><Card><ArgonBox p={3}><ArgonButton onClick={() => navigate("/vendors")}>Back</ArgonButton></ArgonBox></Card></PageShell>;

  return (
    <PageShell title={isEdit ? "Edit Vendor" : "Add Vendor"} description={isEdit ? "Perbarui informasi vendor." : "Tambahkan vendor baru untuk kebutuhan inventory."}>
      <Card>
        <ArgonBox component="form" p={{ xs: 2, sm: 2.5, md: 3 }} onSubmit={handleSubmit}>
          {error ? <ArgonBox mb={3} p={2} bgColor="error" borderRadius="lg"><ArgonTypography variant="button" color="white">{error}</ArgonTypography></ArgonBox> : null}
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>{label("Vendor Name *")}<ArgonInput fullWidth value={form.name} onChange={update("name")} placeholder="Nama vendor" /></Grid>
            <Grid item xs={12} md={6}>{label("Contact Person")}<ArgonInput fullWidth value={form.contactPerson} onChange={update("contactPerson")} placeholder="Nama PIC" /></Grid>
            <Grid item xs={12} md={6}>{label("Phone / WhatsApp")}<ArgonInput fullWidth value={form.phone} onChange={update("phone")} placeholder="08xx..." /></Grid>
            <Grid item xs={12} md={6}>{label("Address")}<ArgonInput fullWidth value={form.address} onChange={update("address")} placeholder="Alamat / kota" /></Grid>
            <Grid item xs={12}>{label("Notes")}<ArgonInput fullWidth multiline rows={4} value={form.notes} onChange={update("notes")} placeholder="Catatan vendor..." /></Grid>
          </Grid>
          <ArgonBox mt={{ xs: 3, md: 4 }} display="flex" flexDirection={{ xs: "column-reverse", sm: "row" }} justifyContent="flex-end" gap={1}><ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} type="button" variant="outlined" color="secondary" onClick={() => navigate(isEdit ? `/vendors/${id}` : "/vendors")}>Cancel</ArgonButton><ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} type="submit" color="primary">{isEdit ? "Save Changes" : "Add Vendor"}</ArgonButton></ArgonBox>
        </ArgonBox>
      </Card>
    </PageShell>
  );
}

export default VendorFormPage;
