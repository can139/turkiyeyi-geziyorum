import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import * as d3 from "d3";
import html2canvas from "html2canvas";
import { MapPin, Check, Lock, Unlock, Calendar, Video, X, StampIcon, Camera, Trash2, Map as MapIcon, LayoutGrid, Share2, Sparkles } from "lucide-react";

const GEOJSON_URL = "https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json";

const SUPABASE_URL = "https://bbfsvvnxqzwzyzyuqbbv.supabase.co";
const SUPABASE_KEY = "sb_publishable_VTT3d27QgklQzwk04LMnZA_JbSwitYR";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PROVINCES = [
  { code: "01", name: "Adana", region: "Akdeniz" },
  { code: "02", name: "Adıyaman", region: "Güneydoğu Anadolu" },
  { code: "03", name: "Afyonkarahisar", region: "Ege" },
  { code: "04", name: "Ağrı", region: "Doğu Anadolu" },
  { code: "05", name: "Amasya", region: "Karadeniz" },
  { code: "06", name: "Ankara", region: "İç Anadolu" },
  { code: "07", name: "Antalya", region: "Akdeniz" },
  { code: "08", name: "Artvin", region: "Karadeniz" },
  { code: "09", name: "Aydın", region: "Ege" },
  { code: "10", name: "Balıkesir", region: "Marmara" },
  { code: "11", name: "Bilecik", region: "Marmara" },
  { code: "12", name: "Bingöl", region: "Doğu Anadolu" },
  { code: "13", name: "Bitlis", region: "Doğu Anadolu" },
  { code: "14", name: "Bolu", region: "Karadeniz" },
  { code: "15", name: "Burdur", region: "Akdeniz" },
  { code: "16", name: "Bursa", region: "Marmara" },
  { code: "17", name: "Çanakkale", region: "Marmara" },
  { code: "18", name: "Çankırı", region: "İç Anadolu" },
  { code: "19", name: "Çorum", region: "Karadeniz" },
  { code: "20", name: "Denizli", region: "Ege" },
  { code: "21", name: "Diyarbakır", region: "Güneydoğu Anadolu" },
  { code: "22", name: "Edirne", region: "Marmara" },
  { code: "23", name: "Elazığ", region: "Doğu Anadolu" },
  { code: "24", name: "Erzincan", region: "Doğu Anadolu" },
  { code: "25", name: "Erzurum", region: "Doğu Anadolu" },
  { code: "26", name: "Eskişehir", region: "İç Anadolu" },
  { code: "27", name: "Gaziantep", region: "Güneydoğu Anadolu" },
  { code: "28", name: "Giresun", region: "Karadeniz" },
  { code: "29", name: "Gümüşhane", region: "Karadeniz" },
  { code: "30", name: "Hakkari", region: "Doğu Anadolu" },
  { code: "31", name: "Hatay", region: "Akdeniz" },
  { code: "32", name: "Isparta", region: "Akdeniz" },
  { code: "33", name: "Mersin", region: "Akdeniz" },
  { code: "34", name: "İstanbul", region: "Marmara" },
  { code: "35", name: "İzmir", region: "Ege" },
  { code: "36", name: "Kars", region: "Doğu Anadolu" },
  { code: "37", name: "Kastamonu", region: "Karadeniz" },
  { code: "38", name: "Kayseri", region: "İç Anadolu" },
  { code: "39", name: "Kırklareli", region: "Marmara" },
  { code: "40", name: "Kırşehir", region: "İç Anadolu" },
  { code: "41", name: "Kocaeli", region: "Marmara" },
  { code: "42", name: "Konya", region: "İç Anadolu" },
  { code: "43", name: "Kütahya", region: "Ege" },
  { code: "44", name: "Malatya", region: "Doğu Anadolu" },
  { code: "45", name: "Manisa", region: "Ege" },
  { code: "46", name: "Kahramanmaraş", region: "Akdeniz" },
  { code: "47", name: "Mardin", region: "Güneydoğu Anadolu" },
  { code: "48", name: "Muğla", region: "Ege" },
  { code: "49", name: "Muş", region: "Doğu Anadolu" },
  { code: "50", name: "Nevşehir", region: "İç Anadolu" },
  { code: "51", name: "Niğde", region: "İç Anadolu" },
  { code: "52", name: "Ordu", region: "Karadeniz" },
  { code: "53", name: "Rize", region: "Karadeniz" },
  { code: "54", name: "Sakarya", region: "Marmara" },
  { code: "55", name: "Samsun", region: "Karadeniz" },
  { code: "56", name: "Siirt", region: "Güneydoğu Anadolu" },
  { code: "57", name: "Sinop", region: "Karadeniz" },
  { code: "58", name: "Sivas", region: "İç Anadolu" },
  { code: "59", name: "Tekirdağ", region: "Marmara" },
  { code: "60", name: "Tokat", region: "Karadeniz" },
  { code: "61", name: "Trabzon", region: "Karadeniz" },
  { code: "62", name: "Tunceli", region: "Doğu Anadolu" },
  { code: "63", name: "Şanlıurfa", region: "Güneydoğu Anadolu" },
  { code: "64", name: "Uşak", region: "Ege" },
  { code: "65", name: "Van", region: "Doğu Anadolu" },
  { code: "66", name: "Yozgat", region: "İç Anadolu" },
  { code: "67", name: "Zonguldak", region: "Karadeniz" },
  { code: "68", name: "Aksaray", region: "İç Anadolu" },
  { code: "69", name: "Bayburt", region: "Karadeniz" },
  { code: "70", name: "Karaman", region: "İç Anadolu" },
  { code: "71", name: "Kırıkkale", region: "İç Anadolu" },
  { code: "72", name: "Batman", region: "Güneydoğu Anadolu" },
  { code: "73", name: "Şırnak", region: "Güneydoğu Anadolu" },
  { code: "74", name: "Bartın", region: "Karadeniz" },
  { code: "75", name: "Ardahan", region: "Doğu Anadolu" },
  { code: "76", name: "Iğdır", region: "Doğu Anadolu" },
  { code: "77", name: "Yalova", region: "Marmara" },
  { code: "78", name: "Karabük", region: "Karadeniz" },
  { code: "79", name: "Kilis", region: "Güneydoğu Anadolu" },
  { code: "80", name: "Osmaniye", region: "Akdeniz" },
  { code: "81", name: "Düzce", region: "Karadeniz" },
];

const REGIONS = ["Tümü", "Marmara", "Ege", "Akdeniz", "İç Anadolu", "Karadeniz", "Doğu Anadolu", "Güneydoğu Anadolu"];

// Her il için kısa, genel bilgi düzeyinde 2-3 öneri
const ATTRACTIONS = {
  "01": ["Sabancı Merkez Camii", "Taşköprü (Roma köprüsü)", "Adana mutfağı - kebap"],
  "02": ["Nemrut Dağı", "Perre Antik Kenti", "Adıyaman Kalesi"],
  "03": ["Frig Vadisi", "Sandıklı termal kaplıcaları", "Ulu Cami"],
  "04": ["Ağrı Dağı (Ararat)", "İshak Paşa Sarayı", "Doğubayazıt"],
  "05": ["Amasya kaya mezarları", "Osmanlı evleri", "Yeşilırmak kıyısı"],
  "06": ["Anıtkabir", "Ankara Kalesi", "Anadolu Medeniyetleri Müzesi"],
  "07": ["Antalya Kaleiçi", "Düden Şelalesi", "Aspendos Antik Tiyatrosu"],
  "08": ["Karagöl", "Şavşat", "Yeşil vadiler ve yaylalar"],
  "09": ["Aydın - Efes'e yakın", "Dilek Yarımadası Milli Parkı", "Söke ovası"],
  "10": ["Kuşcenneti Milli Parkı", "Sarıköy sahili", "Cunda benzeri koylar"],
  "11": ["Bilecik - Şeyh Edebali Türbesi", "Osmaneli tarihi evleri", ""],
  "12": ["Bingöl yaylaları", "Sıcak su kaynakları", ""],
  "13": ["Van Gölü kıyısı (Bitlis tarafı)", "Nemrut Krater Gölü", "Ahlat mezarlığı"],
  "14": ["Abant Gölü", "Bolu Dağı", "Yedigöller Milli Parkı"],
  "15": ["Salda Gölü", "İnsuyu Mağarası", ""],
  "16": ["Ulu Cami", "Cumalıkızık köyü", "Uludağ"],
  "17": ["Gelibolu Yarımadası", "Truva Antik Kenti", "Assos"],
  "18": ["Çankırı tuz mağaraları", "Ilgaz Dağı Milli Parkı", ""],
  "19": ["Hitit başkenti Hattuşa", "Çorum kalesi", ""],
  "20": ["Pamukkale travertenleri", "Hierapolis Antik Kenti", ""],
  "21": ["Diyarbakır Surları", "On Gözlü Köprü", "Hevsel Bahçeleri"],
  "22": ["Selimiye Camii", "Edirne Sarayı kalıntıları", "Sarayiçi"],
  "23": ["Hazar Gölü", "Elazığ kalesi", ""],
  "24": ["Erzincan - Karasu Kanyonu", "Üzümlü mağara evleri", ""],
  "25": ["Palandöken", "Çifte Minareli Medrese", "Erzurum Kalesi"],
  "26": ["Odunpazarı tarihi evleri", "Eskişehir Porsuk Çayı", ""],
  "27": ["Zeugma Mozaik Müzesi", "Gaziantep kalesi", "Baklava kültürü"],
  "28": ["Giresun Adası", "Kümbet Yaylası", ""],
  "29": ["Gümüşhane - Süleymaniye köyü", "Karaca Mağarası", ""],
  "30": ["Hakkari dağları", "Cilo Dağları", ""],
  "31": ["Antakya (Hatay) mozaikleri", "St. Pierre Kilisesi", "Hatay mutfağı"],
  "32": ["Eğirdir Gölü", "Isparta gül bahçeleri", ""],
  "33": ["Mersin Kızkalesi", "Tarsus şelalesi", "Cennet-Cehennem Mağaraları"],
  "34": ["Ayasofya", "Topkapı Sarayı", "Boğaziçi"],
  "35": ["Kadifekale", "Saat Kulesi (Konak)", "İzmir Kordon"],
  "36": ["Ani Ören Yeri", "Kars kalesi", "Kars kaşarı"],
  "37": ["Kastamonu evleri", "İnebolu sahili", ""],
  "38": ["Erciyes Dağı", "Kayseri kalesi", ""],
  "39": ["Kırklareli - Dupnisa Mağarası", "Longoz ormanları", ""],
  "40": ["Kırşehir Cacabey Camii", "Terme kaplıcaları", ""],
  "41": ["Kocaeli - Sapanca'ya yakın", "Kartepe", ""],
  "42": ["Mevlana Müzesi", "Sema gösterisi", "Çatalhöyük"],
  "43": ["Kütahya çinileri", "Frig Vadisi'ne yakın", ""],
  "44": ["Malatya - kayısı bahçeleri", "Arslantepe Höyüğü", ""],
  "45": ["Manisa - Spil Dağı", "Sardes antik kenti", ""],
  "46": ["Kahramanmaraş dondurması", "Yedikuyular tabiat parkı", ""],
  "47": ["Mardin taş evleri", "Deyrülzafaran Manastırı", "Midyat"],
  "48": ["Ölüdeniz", "Bodrum Kalesi", "Muğla köyleri"],
  "49": ["Muş ovası", "Malazgirt", ""],
  "50": ["Kapadokya - Göreme", "Peri bacaları", "Balon turları"],
  "51": ["Niğde kalesi", "Aladağlar Milli Parkı", ""],
  "52": ["Ordu - Boztepe", "Fındık bahçeleri", ""],
  "53": ["Rize çay bahçeleri", "Ayder Yaylası", ""],
  "54": ["Sakarya - Sapanca Gölü", "Maşukiye", ""],
  "55": ["Samsun Bandırma Vapuru", "Amazon Köyü", ""],
  "56": ["Siirt - Botan Vadisi", "Aydınlar ilçesi", ""],
  "57": ["Sinop kalesi ve cezaevi", "İnceburun", ""],
  "58": ["Sivas Divriği Ulu Cami", "Kangal balıklı kaplıca", ""],
  "59": ["Rüstem Paşa Camii", "Şarköy-Mürefte bağları", "Uçmakdere"],
  "60": ["Tokat - Ballıca Mağarası", "Osmanlı evleri", ""],
  "61": ["Sümela Manastırı", "Uzungöl", "Trabzon sahili"],
  "62": ["Munzur Vadisi Milli Parkı", "Tunceli dağları", ""],
  "63": ["Balıklıgöl", "Göbeklitepe", "Şanlıurfa çarşısı"],
  "64": ["Uşak - Ulubey Kanyonları", "", ""],
  "65": ["Van Gölü", "Akdamar Adası", "Van Kalesi"],
  "66": ["Yozgat - Çamlık Milli Parkı", "", ""],
  "67": ["Zonguldak - Gökgöl Mağarası", "Karadeniz sahili", ""],
  "68": ["Aksaray - Ihlara Vadisi", "Hasan Dağı", ""],
  "69": ["Bayburt kalesi", "Kop Dağı", ""],
  "70": ["Karaman - Karadağ", "Binbir Kilise", ""],
  "71": ["Kırıkkale - Delice kanyonları", "", ""],
  "72": ["Batman - Hasankeyf'e yakın", "", ""],
  "73": ["Şırnak - Cudi Dağı", "Nuh'un Gemisi rivayeti", ""],
  "74": ["Bartın tarihi evleri", "Amasra", ""],
  "75": ["Ardahan - Cıldır Gölü", "Çıldır buz pateni", ""],
  "76": ["Iğdır ovası", "Ağrı Dağı manzarası", ""],
  "77": ["Yalova termal kaplıcaları", "Yalova çınarı", ""],
  "78": ["Karabük - Safranbolu evleri", "Yenice ormanları", ""],
  "79": ["Kilis - Ravanda Kalesi", "", ""],
  "80": ["Osmaniye - Karatepe-Aslantaş", "", ""],
  "81": ["Düzce - Efteni Gölü", "Yığılca yaylaları", ""],
};

const ADMIN_PASSWORD = "Nisan2304";

// Türkçe karakterleri normalize edip isimleri kıyaslanabilir hale getirir
function normalizeTrName(str) {
  if (!str) return "";
  return str
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// Bazı kaynaklarda farklı yazılan/eski il isimleri için eşanlamlılar
const NAME_ALIASES = {
  icel: "33", // Mersin'in eski adı
  afyon: "03",
  kmaras: "46",
  maras: "46",
  urfa: "63",
};

const PROVINCE_BY_NORMALIZED_NAME = {};
PROVINCES.forEach((p) => {
  PROVINCE_BY_NORMALIZED_NAME[normalizeTrName(p.name)] = p;
});

function matchProvinceByName(rawName) {
  const key = normalizeTrName(rawName);
  if (PROVINCE_BY_NORMALIZED_NAME[key]) return PROVINCE_BY_NORMALIZED_NAME[key];
  if (NAME_ALIASES[key]) {
    return PROVINCES.find((p) => p.code === NAME_ALIASES[key]);
  }
  return null;
}

function TurkeyMap({ data, onSelectProvince, mapRef }) {
  const [geo, setGeo] = useState(null);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((r) => {
        if (!r.ok) throw new Error("Harita verisi alınamadı");
        return r.json();
      })
      .then(setGeo)
      .catch(() => setGeoError(true));
  }, []);

  const width = 780;
  const height = 400;

  const pathGen = useMemo(() => {
    if (!geo) return null;
    const projection = d3.geoMercator().fitSize([width, height], geo);
    return d3.geoPath(projection);
  }, [geo]);

  if (geoError) {
    return (
      <p className="text-sm text-[#6B7299] py-10 text-center">
        Harita şu anda yüklenemedi, bağlantını kontrol edip sayfayı yenile.
      </p>
    );
  }

  if (!geo || !pathGen) {
    return <p className="text-[#8B93B0] text-sm py-10 text-center">Harita yükleniyor...</p>;
  }

  // Ziyaret tarihine göre sıralı rota noktalarını hesapla
  const routePoints = (() => {
    const visitedWithDate = PROVINCES.filter((p) => data[p.code]?.visited && data[p.code]?.date).sort(
      (a, b) => new Date(data[a.code].date) - new Date(data[b.code].date)
    );
    if (visitedWithDate.length < 2) return [];
    const pointsByCode = {};
    geo.features.forEach((f) => {
      const rawName = f.properties?.name || f.properties?.NAME || f.properties?.il || "";
      const province = matchProvinceByName(rawName);
      if (province) pointsByCode[province.code] = pathGen.centroid(f);
    });
    return visitedWithDate.map((p) => pointsByCode[p.code]).filter(Boolean);
  })();

  return (
    <svg ref={mapRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
      {geo.features.map((f, i) => {
        const rawName = f.properties?.name || f.properties?.NAME || f.properties?.il || "";
        const province = matchProvinceByName(rawName);
        const code = province?.code;
        const visited = code ? data[code]?.visited : false;
        const planned = code ? !visited && data[code]?.planned : false;
        return (
          <path
            key={code || `feature-${i}`}
            d={pathGen(f)}
            fill={visited ? "#D9A544" : planned ? "#3A5A94" : "#232C4D"}
            stroke="#10152A"
            strokeWidth={0.6}
            className={province ? "cursor-pointer transition-colors hover:opacity-80" : ""}
            onClick={() => province && onSelectProvince(province)}
          >
            <title>{province ? `${province.code} · ${province.name}` : rawName}</title>
          </path>
        );
      })}

      {/* Ziyaret sırasına göre rota çizgisi */}
      {routePoints.length > 1 && (
        <>
          <polyline
            points={routePoints.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="#E8C275"
            strokeWidth={1.1}
            strokeDasharray="2.5 2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.85}
          />
          {routePoints.map(([x, y], i) => (
            <circle key={`stop-${i}`} cx={x} cy={y} r={1.6} fill="#E8C275" stroke="#10152A" strokeWidth={0.4} />
          ))}
        </>
      )}

      {geo.features.map((f, i) => {
        const rawName = f.properties?.name || f.properties?.NAME || f.properties?.il || "";
        const province = matchProvinceByName(rawName);
        if (!province) return null;
        const visited = data[province.code]?.visited;
        const [cx, cy] = pathGen.centroid(f);
        return (
          <text
            key={`label-${province.code}-${i}`}
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            className="pointer-events-none select-none"
            style={{
              fontSize: 4.4,
              fill: visited ? "#10152A" : "#8B93B0",
              fontFamily: "'Segoe UI', ui-sans-serif, system-ui",
            }}
          >
            {province.name}
          </text>
        );
      })}
    </svg>
  );
}

export default function TurkiyeGeziyorum() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState("Tümü");
  const [viewMode, setViewMode] = useState("grid");
  const [shareCopied, setShareCopied] = useState(false);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [draft, setDraft] = useState({ visited: false, planned: false, date: "", note: "", video: "", photos: [] });
  const [saving, setSaving] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const mapSvgRef = useRef(null);
  const storyCardRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: rows, error } = await supabase.from("provinces").select("code, data");
        if (error) throw error;
        const obj = {};
        (rows || []).forEach((r) => {
          obj[r.code] = r.data;
        });
        if (obj["cover"]?.photo) setCoverPhoto(obj["cover"].photo);
        delete obj["cover"];
        setData(obj);
      } catch (e) {
        console.error("Yükleme hatası:", e);
        setData({});
      }
      setLoading(false);
    })();
  }, []);

  function handleCoverPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const photoData = reader.result;
      try {
        const { data: existing } = await supabase.from("provinces").select("id").eq("code", "cover").maybeSingle();
        let error;
        if (existing) {
          ({ error } = await supabase.from("provinces").update({ data: { photo: photoData } }).eq("code", "cover"));
        } else {
          ({ error } = await supabase.from("provinces").insert({ code: "cover", data: { photo: photoData } }));
        }
        if (error) throw error;
        setCoverPhoto(photoData);
      } catch (err) {
        console.error("Kapak fotoğrafı kaydedilemedi:", err);
      }
      setCoverUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function removeCover() {
    setCoverUploading(true);
    try {
      const { error } = await supabase.from("provinces").update({ data: { photo: null } }).eq("code", "cover");
      if (error) throw error;
      setCoverPhoto(null);
    } catch (err) {
      console.error("Kapak fotoğrafı silinemedi:", err);
    }
    setCoverUploading(false);
  }

  const visitedCount = Object.values(data).filter((d) => d?.visited).length;
  const progress = Math.round((visitedCount / 81) * 100);

  const visitedProvinces = useMemo(() => {
    return PROVINCES.filter((p) => data[p.code]?.visited);
  }, [data]);

  async function handleShare() {
    const shareText = `Türkiye'yi Geziyorum · ${visitedCount}/81 il tamamladım! 🇹🇷`;
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Türkiye'yi Geziyorum", text: shareText, url: shareUrl });
      } catch (e) {
        // İptal durumu
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch (e) {
        console.error("Kopyalama hatası:", e);
      }
    }
  }

  async function handleDownloadStory() {
    if (!storyCardRef.current) return;
    setGeneratingStory(true);

    try {
      const storyMapContainer = document.getElementById("story-svg-target");
      if (storyMapContainer) {
        storyMapContainer.innerHTML = "";
        if (mapSvgRef.current) {
          const clone = mapSvgRef.current.cloneNode(true);
          clone.style.width = "100%";
          clone.style.height = "auto";
          storyMapContainer.appendChild(clone);
        }
      }

      storyCardRef.current.style.display = "flex";

      const canvas = await html2canvas(storyCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#10152A",
      });

      storyCardRef.current.style.display = "none";

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setGeneratingStory(false);
          return;
        }

        const file = new File([blob], "turkiyeyi-geziyorum-hikaye.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Türkiye'yi Geziyorum",
              text: `Türkiye'nin %${progress}'ini gezdim! 📍`,
            });
            setGeneratingStory(false);
            return;
          } catch (e) {
            // Paylaşım iptal edilirse indirmeye geç
          }
        }

        const link = document.createElement("a");
        link.download = "turkiyeyi-geziyorum-hikaye.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        setGeneratingStory(false);
      });
    } catch (err) {
      console.error("Hikaye oluşturma hatası:", err);
      if (storyCardRef.current) storyCardRef.current.style.display = "none";
      setGeneratingStory(false);
    }
  }

  const filtered = PROVINCES.filter((p) => activeRegion === "Tümü" || p.region === activeRegion);

  function openProvince(p) {
    const existing = data[p.code] || { visited: false, planned: false, date: "", note: "", video: "", photos: [] };
    setDraft({ photos: [], ...existing });
    setSelected(p);
    fetchWeather(p.name);
  }

  async function fetchWeather(provinceName) {
    setWeather(null);
    setWeatherLoading(true);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(provinceName)}&count=1&language=tr&country=TR`
      );
      const geoData = await geoRes.json();
      const loc = geoData?.results?.[0];
      if (!loc) throw new Error("Konum bulunamadı");
      const wRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code&timezone=auto`
      );
      const wData = await wRes.json();
      setWeather({
        temp: Math.round(wData?.current?.temperature_2m),
        code: wData?.current?.weather_code,
      });
    } catch (e) {
      setWeather(null);
    }
    setWeatherLoading(false);
  }

  function weatherDescription(code) {
    if (code === 0) return { text: "Açık", emoji: "☀️" };
    if ([1, 2, 3].includes(code)) return { text: "Parçalı bulutlu", emoji: "⛅" };
    if ([45, 48].includes(code)) return { text: "Sisli", emoji: "🌫️" };
    if ([51, 53, 55, 56, 57].includes(code)) return { text: "Çisenti", emoji: "🌦️" };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { text: "Yağmurlu", emoji: "🌧️" };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { text: "Karlı", emoji: "❄️" };
    if ([95, 96, 99].includes(code)) return { text: "Fırtınalı", emoji: "⛈️" };
    return { text: "", emoji: "🌤️" };
  }

  function handlePhotoUpload(e) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setDraft((d) => ({ ...d, photos: [...(d.photos || []), reader.result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function removePhoto(index) {
    setDraft((d) => ({ ...d, photos: d.photos.filter((_, i) => i !== index) }));
  }

  function closeModal() {
    setSelected(null);
    setLoginError(false);
  }

  async function saveDraft() {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from("provinces")
        .select("id")
        .eq("code", selected.code)
        .maybeSingle();

      let error;
      if (existing) {
        ({ error } = await supabase.from("provinces").update({ data: draft }).eq("code", selected.code));
      } else {
        ({ error } = await supabase.from("provinces").insert({ code: selected.code, data: draft }));
      }
      if (error) throw error;
      setData((prev) => ({ ...prev, [selected.code]: draft }));
    } catch (e) {
      console.error("Kayıt hatası:", e);
    }
    setSaving(false);
    closeModal();
  }

  function tryLogin() {
    if (pwInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      setPwInput("");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#10152A] text-[#EDE6D6]" style={{ fontFamily: "'Segoe UI', ui-sans-serif, system-ui" }}>
      {/* Gizli Story Şablonu */}
      <div
        ref={storyCardRef}
        style={{
          display: "none",
          position: "fixed",
          left: "-9999px",
          width: "540px",
          height: "960px",
          backgroundColor: "#10152A",
          backgroundImage: "radial-gradient(circle at 50% 10%, #1c2444 0%, #10152A 100%)",
          color: "#EDE6D6",
          padding: "45px 35px",
          boxSizing: "border-box",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "13px", letterSpacing: "3px", color: "#D9A544", textTransform: "uppercase", margin: 0, fontWeight: 700 }}>
            TÜRKİYE'Yİ GEZİYORUM
          </p>
          <h1 style={{ fontSize: "28px", margin: "8px 0 0 0", fontFamily: "Georgia, serif", color: "#FFF" }}>
            Seyahat Günlüğüm
          </h1>
        </div>

        <div
          id="story-svg-target"
          style={{
            width: "100%",
            height: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(217,165,68,0.2)",
            borderRadius: "20px",
            padding: "15px",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1, background: "#161C36", padding: "18px", borderRadius: "18px", border: "1px solid #2A3358", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "#8B93B0", display: "block", marginBottom: "4px" }}>Gezilen Şehir</span>
            <span style={{ fontSize: "32px", fontWeight: "bold", color: "#D9A544", fontFamily: "Georgia, serif" }}>{visitedCount} / 81</span>
          </div>
          <div style={{ flex: 1, background: "#161C36", padding: "18px", borderRadius: "18px", border: "1px solid #2A3358", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "#8B93B0", display: "block", marginBottom: "4px" }}>Tamamlanan</span>
            <span style={{ fontSize: "32px", fontWeight: "bold", color: "#E8C275", fontFamily: "Georgia, serif" }}>%{progress}</span>
          </div>
        </div>

        <div style={{ background: "#161C36", borderRadius: "18px", padding: "16px 20px", border: "1px solid #2A3358" }}>
          <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: "#8B93B0", textTransform: "uppercase", letterSpacing: "1px" }}>Son Ziyaret Edilen İller</p>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#EDE6D6" }}>
            {visitedProvinces.length > 0 ? visitedProvinces.slice(-4).map((p) => p.name).join(" • ") : "Henüz şehir eklenmedi"}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #2A3358", paddingTop: "18px" }}>
          <span style={{ fontSize: "12px", color: "#6B7299" }}>turkiyeyi-geziyorum-mu.vercel.app</span>
          <span style={{ fontSize: "12px", color: "#D9A544", fontWeight: 600 }}>📍 81 İl Yolculuğu</span>
        </div>
      </div>

      {/* Arka Plan Harita Yükleyici (Story için gizli bileşen) */}
      <div className="hidden">
        <TurkeyMap data={data} onSelectProvince={() => {}} mapRef={mapSvgRef} />
      </div>

      {/* Cover photo */}
      <div className="relative w-full h-40 sm:h-56 bg-[#151B33] overflow-hidden">
        {coverPhoto && (
          <img src={coverPhoto} alt="Kapak fotoğrafı" className="w-full h-full object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: coverPhoto
              ? "linear-gradient(180deg, rgba(16,21,42,0.15) 0%, rgba(16,21,42,0.85) 100%)"
              : "transparent",
          }}
        />
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2">
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverPick} className="hidden" />
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-black/50 backdrop-blur border border-white/20 text-[#EDE6D6] hover:bg-black/70 transition-colors disabled:opacity-60"
            >
              <Camera size={13} />
              {coverUploading ? "Yükleniyor..." : coverPhoto ? "Kapak fotoğrafını değiştir" : "Kapak fotoğrafı ekle"}
            </button>
            {coverPhoto && (
              <button
                onClick={removeCover}
                disabled={coverUploading}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur border border-white/20 text-[#EDE6D6] hover:bg-black/70 transition-colors disabled:opacity-60"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="border-b border-[#2A3358] bg-[#151B33] px-5 py-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1
              className="text-2xl sm:text-3xl tracking-tight"
              style={{ fontFamily: "Georgia, 'Iowan Old Style', serif" }}
            >
              Türkiye'yi Geziyorum
            </h1>
            <p className="text-sm text-[#8B93B0] mt-1">81 ilde bir yolculuğun günlüğü</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadStory}
              disabled={generatingStory}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-[#D9A544]/60 bg-[#D9A544]/10 text-[#E8C275] hover:bg-[#D9A544]/20 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Sparkles size={14} />
              {generatingStory ? "Hazırlanıyor..." : "Hikaye Kartı"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-[#2A3358] bg-[#1C2440] hover:bg-[#232C4D] transition-colors whitespace-nowrap"
            >
              <Share2 size={14} />
              {shareCopied ? "Kopyalandı!" : "Paylaş"}
            </button>
            <button
              onClick={() => (isAdmin ? setIsAdmin(false) : setShowLogin(true))}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-[#2A3358] bg-[#1C2440] hover:bg-[#232C4D] transition-colors whitespace-nowrap"
            >
              {isAdmin ? <Unlock size={14} className="text-[#D9A544]" /> : <Lock size={14} />}
              {isAdmin ? "Düzenleniyor" : "Giriş"}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-3xl mx-auto mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-[#8B93B0]">İlerleme</span>
            <span className="text-sm font-medium" style={{ fontFamily: "Georgia, serif" }}>
              <span className="text-[#E8C275] text-base">{visitedCount}</span> / 81 il
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#232C4D] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D9A544] to-[#E8C275] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="max-w-3xl mx-auto px-5 pt-5 flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {viewMode === "grid" &&
            REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`shrink-0 text-xs px-3.5 py-2 rounded-full border transition-colors ${
                  activeRegion === r
                    ? "bg-[#D9A544] text-[#10152A] border-[#D9A544] font-medium"
                    : "border-[#2A3358] text-[#8B93B0] hover:border-[#4A5590]"
                }`}
              >
                {r}
              </button>
            ))}
        </div>
        <div className="shrink-0 flex gap-1 border border-[#2A3358] rounded-full p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-full transition-colors ${viewMode === "grid" ? "bg-[#D9A544] text-[#10152A]" : "text-[#8B93B0]"}`}
            aria-label="Liste görünümü"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`p-1.5 rounded-full transition-colors ${viewMode === "map" ? "bg-[#D9A544] text-[#10152A]" : "text-[#8B93B0]"}`}
            aria-label="Harita görünümü"
          >
            <MapIcon size={15} />
          </button>
        </div>
      </div>

      {/* Map */}
      {viewMode === "map" && (
        <div className="max-w-3xl mx-auto px-5 py-5">
          <TurkeyMap data={data} onSelectProvince={openProvince} />
        </div>
      )}

      {/* Grid */}
      {viewMode === "grid" && (
        <div className="max-w-3xl mx-auto px-5 py-5">
          {loading ? (
            <p className="text-[#8B93B0] text-sm py-10 text-center">Yükleniyor...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((p) => {
                const entry = data[p.code];
                const v = entry?.visited;
                const planned = !v && entry?.planned;
                const thumb = entry?.photos && entry.photos.length > 0 ? entry.photos[0] : null;
                return (
                  <button
                    key={p.code}
                    onClick={() => openProvince(p)}
                    className={`relative text-left rounded-xl border overflow-hidden transition-all ${
                      v
                        ? "bg-[#1E2545] border-[#D9A544]/40"
                        : planned
                        ? "bg-[#182241] border-[#6B9FE8]/40"
                        : "bg-[#161C36] border-[#2A3358] hover:border-[#4A5590]"
                    }`}
                  >
                    {thumb && (
                      <img src={thumb} alt={p.name} className="w-full h-20 object-cover" />
                    )}
                    <div className="flex items-start justify-between p-3.5">
                      <div>
                        <div className="text-[10px] text-[#6B7299] tracking-widest">{p.code}</div>
                        <div className="text-sm font-medium mt-0.5 leading-tight">{p.name}</div>
                      </div>
                      {v ? (
                        <div
                          className="shrink-0 w-8 h-8 rounded-full border-2 border-[#D9A544] flex items-center justify-center -rotate-12 opacity-90"
                        >
                          <Check size={14} className="text-[#E8C275]" strokeWidth={3} />
                        </div>
                      ) : planned ? (
                        <div
                          className="shrink-0 w-8 h-8 rounded-full border-2 border-[#6B9FE8] flex items-center justify-center opacity-90"
                          title="Sıradaki durak"
                        >
                          <span className="text-xs">🧭</span>
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Login popover */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-5 z-50" onClick={() => setShowLogin(false)}>
          <div
            className="bg-[#161C36] border border-[#2A3358] rounded-2xl p-5 w-full max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-medium mb-3">Yönetici girişi</h3>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => {
                setPwInput(e.target.value);
                setLoginError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && tryLogin()}
              placeholder="Şifre"
              className="w-full bg-[#10152A] border border-[#2A3358] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D9A544]"
              autoFocus
            />
            {loginError && <p className="text-xs text-red-400 mt-2">Şifre yanlış.</p>}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowLogin(false)}
                className="flex-1 text-xs py-2 rounded-lg border border-[#2A3358] text-[#8B93B0]"
              >
                Vazgeç
              </button>
              <button
                onClick={tryLogin}
                className="flex-1 text-xs py-2 rounded-lg bg-[#D9A544] text-[#10152A] font-medium"
              >
                Giriş yap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Province detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50" onClick={closeModal}>
          <div
            className="bg-[#161C36] border border-[#2A3358] rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="text-[10px] text-[#6B7299] tracking-widest">{selected.code} · {selected.region}</div>
                <h2 className="text-xl" style={{ fontFamily: "Georgia, serif" }}>{selected.name}</h2>
              </div>
              <button onClick={closeModal} className="text-[#8B93B0] hover:text-[#EDE6D6] p-1">
                <X size={20} />
              </button>
            </div>

            {/* Hava durumu */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              {weatherLoading ? (
                <span className="text-[#6B7299] text-xs">Hava durumu yükleniyor...</span>
              ) : weather ? (
                <span className="inline-flex items-center gap-1.5 text-[#C9CEE3]">
                  <span>{weatherDescription(weather.code).emoji}</span>
                  <span className="font-medium">{weather.temp}°C</span>
                  <span className="text-[#8B93B0] text-xs">{weatherDescription(weather.code).text}</span>
                </span>
              ) : null}
            </div>

            {/* Yer önerileri */}
            {ATTRACTIONS[selected.code]?.filter(Boolean).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ATTRACTIONS[selected.code].filter(Boolean).map((place, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#1C2440] border border-[#2A3358] text-[#8AB4E8]"
                  >
                    📍 {place}
                  </span>
                ))}
              </div>
            )}

            {!isAdmin ? (
              <div className="mt-4 space-y-3">
                {draft.visited ? (
                  <>
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#E8C275] border border-[#D9A544]/40 rounded-full px-3 py-1">
                      <Check size={12} strokeWidth={3} /> Ziyaret edildi{draft.date ? ` · ${draft.date}` : ""}
                    </div>
                    {draft.photos && draft.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {draft.photos.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`${selected.name} fotoğraf ${i + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border border-[#2A3358]"
                          />
                        ))}
                      </div>
                    )}
                    {draft.note && <p className="text-sm text-[#C9CEE3] leading-relaxed whitespace-pre-wrap">{draft.note}</p>}
                    {draft.video && (
                      <a
                        href={draft.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#8AB4F8] underline"
                      >
                        <Video size={13} /> Videoyu izle
                      </a>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-[#6B7299]">
                    {draft.planned ? "🧭 Sıradaki durak — henüz gidilmedi." : "Bu il henüz ziyaret edilmedi."}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.visited}
                    onChange={(e) => setDraft({ ...draft, visited: e.target.checked, planned: e.target.checked ? false : draft.planned })}
                    className="w-4 h-4 accent-[#D9A544]"
                  />
                  Ziyaret edildi
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer -mt-2">
                  <input
                    type="checkbox"
                    checked={!!draft.planned && !draft.visited}
                    disabled={draft.visited}
                    onChange={(e) => setDraft({ ...draft, planned: e.target.checked })}
                    className="w-4 h-4 accent-[#6B9FE8] disabled:opacity-40"
                  />
                  <span className={draft.visited ? "text-[#6B7299]" : ""}>Sıradaki durak (planlandı)</span>
                </label>

                <div>
                  <label className="text-xs text-[#8B93B0] flex items-center gap-1 mb-1">
                    <Calendar size={12} /> Tarih
                  </label>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    className="w-full bg-[#10152A] border border-[#2A3358] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D9A544]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8B93B0] mb-1 block">Anı / notlar</label>
                  <textarea
                    value={draft.note}
                    onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                    rows={4}
                    placeholder="Bu ilde neler yaşadın?"
                    className="w-full bg-[#10152A] border border-[#2A3358] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D9A544] resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8B93B0] flex items-center gap-1 mb-1">
                    <Camera size={12} /> Fotoğraflar
                  </label>
                  {draft.photos && draft.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {draft.photos.map((src, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={src}
                            alt={`Fotoğraf ${i + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border border-[#2A3358]"
                          />
                          <button
                            onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                          >
                            <Trash2 size={12} className="text-[#EDE6D6]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-lg border border-dashed border-[#3A4470] text-[#8B93B0] hover:border-[#D9A544] hover:text-[#E8C275] transition-colors"
                  >
                    <Camera size={13} /> Fotoğraf ekle
                  </button>
                </div>

                <div>
                  <label className="text-xs text-[#8B93B0] flex items-center gap-1 mb-1">
                    <Video size={12} /> Video linki (YouTube/Instagram)
                  </label>
                  <input
                    type="text"
                    value={draft.video}
                    onChange={(e) => setDraft({ ...draft, video: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#10152A] border border-[#2A3358] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D9A544]"
                  />
                </div>

                <button
                  onClick={saveDraft}
                  disabled={saving}
                  className="w-full py-2.5 rounded-lg bg-[#D9A544] text-[#10152A] font-medium text-sm disabled:opacity-60"
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center text-[10px] text-[#4A5074] py-6">Türkiye'yi Geziyorum · 81 il, tek yolculuk</div>
    </div>
  );
}
