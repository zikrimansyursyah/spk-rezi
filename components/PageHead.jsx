export default function PageHead({ title }) {
  return (
    <>
      <meta name="description" content='Aplikasi SPK siswa kurang mampu untuk mendapatkan beasiswa' />
      <meta name="keywords" content='SPK, Sistem Penunjang Keputusan, Sekolah Dasar, SDN DURI KEPA 01' />
      <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" href="logo192.png" />
      <title>{title ? `${title} - SDN Duri Kepa 02` : 'SDN Duri Kepa 02'}</title>
    </>
  )
}
