import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Mail, HeartPulse, Gift, HandHeart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type LeadRaw = { name: string; email: string; prayer: string };
function loadLeadRawInline(): LeadRaw | null {
  try {
    const v = sessionStorage.getItem("lv_lead_raw_v3");
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

// --- carrega também o lead "masked" do sessionStorage
type LeadMasked = { name: string; email: string; prayer: string };
function loadLeadMaskedInline(): LeadMasked | null {
  try {
    const v = sessionStorage.getItem("lv_lead_masked_v3");
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}



function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}


// --- monta URL do checkout Digistore com pré-preenchimento via GET
// --- monta URL do checkout Digistore
function buildDigistoreUrl(productId: string, opts?: { plan?: string }) {
  const raw  = loadLeadRawInline();     // dados reais (se precisar)
  const masked = loadLeadMaskedInline(); // dados embaralhados (como você pediu)

  // segurança: se por algum motivo não houver masked, cai no raw
  const name  = masked?.name  || raw?.name  || "";
  const email = masked?.email || raw?.email || "";

  const { first, last } = splitName(name);

  const base = `https://www.checkout-ds24.com/product/${encodeURIComponent(productId)}`;
  const params = new URLSearchParams();

  if (first) params.set("first_name", first);
  if (last)  params.set("last_name",  last);

  if (email) params.set("email", email);

  params.set("lang", "en");
  params.set("currency", "USD");

  if (opts?.plan) {
    params.set("plan", String(opts.plan));
    params.set("hide_plans", "");
  }

  return `${base}?${params.toString()}`;
}

const Confirmation = () => {
  const [headline, setHeadline] = useState("");
  const [paragraph, setParagraph] = useState("");

  const location = useLocation();
  const state = location.state as { nome?: string; genero?: string } | null;

  // nome de saudação (mantido como no seu código)
  const rawLead = useMemo(() => loadLeadRawInline(), []);
  const nome = (state?.nome || rawLead?.name || "").trim();

  let firstName = "Friend";
  if (nome) {
    const partes = nome.split(/\s+/);
    if (partes.length > 0) {
      firstName = partes[0].charAt(0).toUpperCase() + partes[0].slice(1).toLowerCase();
    }
  }
  const saudacao = `Dear ${firstName},`;

    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg flex justify-between items-center py-4">
        <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <HandHeart className="text-[#5f9ea0]" size={24} />
        </div>
        <h1 className="text-xl font-playfair font-semibold text-[#5f9ea0]">Volunteers of Lourdes</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
        <a href="#como-funciona" className="text-sm text-gray-700 hover:text-[#5f9ea0] transition-colors">How It Works</a>
        <a href="#por-que-lourdes" className="text-sm text-gray-700 hover:text-[#5f9ea0] transition-colors">Why Lourdes?</a>
        <a href="#contribuicao" className="text-sm text-gray-700 hover:text-[#5f9ea0] transition-colors">Contribute</a>
        </nav>

        <div className="md:hidden">
        <Button variant="ghost" size="sm">
          <span className="sr-only">Open menu</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </Button>
        </div>
      </div>
      </header>

      <main>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-2 sm:px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg text-center max-w-4xl">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#5f9ea0]/10 rounded-full flex items-center justify-center">
          <HeartPulse className="text-[#5f9ea0]" size={40} />
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 text-[#333333]">
      {headline || "📿 Just one more step for your prayer to reach the Grotto of Lourdes"}
    </h2>
        </div>
      </section>
      
      {/* Personal Greeting Section */}
        <section className="py-16 px-2 sm:px-4 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-4xl">
        <h3 className="text-2xl md:text-3xl font-playfair font-semibold mb-6 text-[#5f9ea0]">
          {saudacao}
        </h3>

            {paragraph && (
              <p className="text-lg mb-6 leading-relaxed">
                {paragraph}
              </p>
            )}
        
        <div className="flex flex-col gap-8">
          <div>
          <p className="text-lg mb-4 leading-relaxed">
            This is Father Afonso Freitas, and I write to you today with great joy and hope in my heart. For many years, my wife and I have been blessed to serve as volunteers at the Grotto of Lourdes – a place where miracles of healing happen every day.
          </p>
          <p className="text-lg mb-4 leading-relaxed">
            Whenever I stand before the Grotto, I am moved by the testimonies of people who have found healing, peace, and restoration in body and spirit. This sacred place, where the Blessed Virgin Mary appeared, is known worldwide for its divine power to heal. By the grace of God, we have the privilege of taking your prayers to this miraculous place.
          </p>
          </div>
          <div className="my-8 rounded-xl overflow-hidden shadow-lg">
          <img 
            src="/img04.webp" 
            alt="Grotto of Lourdes" 
            className="w-full max-w-none aspect-video object-cover"
          />
          </div> </div>
        </div>
      </section>
      
      {/* Lourdes: A Place of Miracles */}
      <section className="py-16 px-2 sm:px-4 bg-blue-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-4xl">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-playfair font-semibold mb-6 text-[#5f9ea0]">
          Lourdes: A Place of Miracles
          </h3>
          
          <p className="text-lg mb-4 leading-relaxed">
          Friend, I have personally witnessed the healing power of prayer in Lourdes. I have seen people find relief from chronic illnesses, recover physically, and achieve an inner peace that only God can offer. It is as if Heaven touches Earth in Lourdes — and every prayer lifted there is received with compassion and divine mercy.
          </p>
          
          <p className="text-lg leading-relaxed">
          Healing in Lourdes is not just physical — it is spiritual and emotional as well. Thousands of pilgrims seek divine intervention and, through the intercession of the Virgin Mary, receive miracles beyond anything they could imagine.
          </p>
        </div>
        </div>
      </section>
      
      {/* Prayer Journey Steps */}
      <section id="como-funciona" className="py-16 md:py-24 px-2 sm:px-4 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-5xl">
        <h3 className="text-3xl font-playfair font-semibold mb-12 text-center text-[#333333]">
          The Journey of Your Prayer
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md flex flex-col items-center">
          <div className="w-20 h-20 bg-[#5f9ea0]/10 rounded-full flex items-center justify-center mb-6">
            <Mail className="text-[#5f9ea0]" size={32} />
          </div>
          <h4 className="font-playfair text-xl font-semibold mb-4 text-[#333333]">Step 1</h4>
          <p className="text-center">Your prayer is printed with respect and care.</p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md flex flex-col items-center">
          <div className="w-20 h-20 bg-[#5f9ea0]/10 rounded-full flex items-center justify-center mb-6">
            <MapPin className="text-[#5f9ea0]" size={32} />
          </div>
          <h4 className="font-playfair text-xl font-semibold mb-4 text-[#333333]">Step 2</h4>
          <p className="text-center">Your prayer is personally delivered to the Grotto of Lourdes, placed in a sacred spot where miracles have already happened. We also perform a special blessing for you.</p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md flex flex-col items-center">
          <div className="w-20 h-20 bg-[#5f9ea0]/10 rounded-full flex items-center justify-center mb-6">
            <Check className="text-[#5f9ea0]" size={32} />
          </div>
          <h4 className="font-playfair text-xl font-semibold mb-4 text-[#333333]">Step 3</h4>
          <p className="text-center">You will receive by email the photos of your prayer placed at the Grotto as soon as we arrive at the sacred site, during the monthly visit.</p>
          </div>
        </div>
        </div>
      </section>
      
      {/* What Makes Lourdes Extraordinary */}
      <section id="por-que-lourdes" className="py-16 px-2 sm:px-4 bg-blue-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-4xl">
        <h3 className="text-3xl font-playfair font-semibold mb-8 text-center text-[#333333]">
          What Makes Lourdes So Extraordinary?
        </h3>
        
        <div className="flex flex-col gap-8">
          <div>
          <p className="text-lg mb-4 leading-relaxed">
            Lourdes is recognized worldwide as a sanctuary of healing, where the sick seek relief and restoration. Every day, I see faith transform lives in this place. Whether for physical healing, inner peace, or spiritual renewal, the presence of the Virgin Mary can be felt in every corner of this sacred place.
          </p>
          
          <p className="text-lg leading-relaxed">
            For over 160 years, millions of people have sought healing here — and many have been blessed with miraculous recoveries. Hearts restored, bodies healed, hopes renewed. It seems that the veil between Heaven and Earth becomes thinner in Lourdes, allowing our prayers to quickly reach the ears of the Father.
          </p>
          </div>
          <div className="my-8 rounded-xl overflow-hidden shadow-lg">
          <img 
            src="/img05.webp" 
            alt="River between mountains" 
            className="w-full max-w-none aspect-video object-cover"
          />
          </div>
        </div>
        </div>
      </section>
      
      {/* Join the Healing Chain */}
      <section className="py-16 px-2 sm:px-4 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-4xl">
        <div className="bg-[#5f9ea0]/5 border border-[#5f9ea0]/10 p-8 rounded-xl shadow-sm">
          <h3 className="text-2xl md:text-3xl font-playfair font-semibold mb-6 text-center text-[#333333]">
          Join This Chain of Healing and Faith
          </h3>
          
          <p className="text-lg mb-6 text-center leading-relaxed">
          You have the precious opportunity to send your prayer to the Grotto of Lourdes — a sacred place known for healing miracles. Imagine your deepest requests being taken in faith to this blessed ground. Whether for yourself or a loved one, this act of faith is more than a request — it is a direct connection with our Lord and with all who have been touched by the grace of Lourdes.
          </p>
        </div>
        </div>
      </section>
      
      {/* Ready to Feel Lourdes' Healing Power */}
      <section className="py-16 px-2 sm:px-4 bg-blue-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-4xl">
        <h3 className="text-2xl md:text-3xl font-playfair font-semibold mb-6 text-[#5f9ea0]">
          Are You Ready to Feel the Healing Power of Lourdes?
        </h3>
        
        <div className="flex flex-col gap-8">
          <div className="my-8 rounded-xl overflow-hidden shadow-lg">
          <img 
            src="/img06.webp" 
            alt="Pine trees" 
            className="w-full max-w-none aspect-video object-cover"
          />
          </div> <div>
          <p className="text-lg leading-relaxed">
            There is nothing like the peace and healing that fills the heart when we entrust our prayers to Lourdes. Whether for physical healing, spiritual restoration, or emotional relief, this holy place has the power to renew by the grace of God.
          </p>
          </div>
        </div>
        </div>
      </section>
      
      {/* Contribution Section */}
      <section id="contribuicao" className="py-16 px-2 sm:px-4 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-4xl">
        <h3 className="text-2xl md:text-3xl font-playfair font-semibold mb-6 text-[#5f9ea0] text-center">
          Send Your Prayer Request Now
        </h3>
        
        <p className="text-lg mb-8 text-center leading-relaxed max-w-3xl mx-auto">
          We know that not everyone has the chance to leave their prayers in one of the most sacred places in the world — especially in difficult financial times. That is why we decided to help others send their prayers and receive the blessings they deserve.
        </p>
        
        <p className="text-lg mb-10 text-center font-semibold max-w-3xl mx-auto">
          As devotees, we never want money to be an obstacle to your sincere prayers.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Option 1 */}
          <Card className="border-[#5f9ea0]/30 shadow-md hover:shadow-lg transition-all">
          <CardContent className="pt-6 px-4 pb-6">
            <div className="flex justify-center mb-4">
            <Gift className="text-[#5f9ea0]" size={32} />
            </div>
            
            <h3 className="font-playfair font-semibold text-2xl md:text-3xl mb-2 text-center">$9</h3>
            <h4 className="font-sans text-lg mb-4 text-center">I Need a Little Support</h4>
            
            <p className="text-sm mb-6 text-center italic">
            "Please take my prayer to Lourdes. At the moment, I cannot afford the full amount, but I wish to take part in this sacred act."
            </p>
            
            <Button className="w-full bg-[#5f9ea0] hover:bg-[#4e8a8c] text-white px-4 py-2 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all" asChild>
            <a
                      href={buildDigistoreUrl("624608")}
                      target="_blank"
                      rel="noopener noreferrer"
            >
              Include my prayer
            </a>
            </Button>
            
            <p className="text-xs mt-3 text-center text-gray-500">
            It is an honor to include your prayer.
            </p>
          </CardContent>
          </Card>
          
          {/* Option 2 */}
          <Card className="border-[#5f9ea0] shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#5f9ea0] text-white text-xs py-1 px-3 rounded-bl-lg">
            Recommended
          </div>
          <CardContent className="pt-6 px-4 pb-6">
            <div className="flex justify-center mb-4">
            <HeartPulse className="text-[#5f9ea0]" size={32} />
            </div>
            
            <h3 className="font-playfair font-semibold text-2xl md:text-3xl mb-2 text-center">$19</h3>
            <h4 className="font-sans text-lg mb-4 text-center">Actual Delivery Cost</h4>
            
            <p className="text-sm mb-6 text-center italic">
            "I am covering the full cost to take my prayer to the Grotto. Thank you for making this possible."
            </p>
            
            <Button className="w-full bg-[#5f9ea0] hover:bg-[#4e8a8c] text-white px-4 py-2 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all" asChild>
            <a href={buildDigistoreUrl("624609", { plan: "0" })} target="_blank" rel="noopener noreferrer">
              Complete Prayer Delivery
            </a>
            </Button>
            
            <p className="text-xs mt-3 text-center text-gray-500">
            This is the actual cost of the delivery mission.
            </p>
          </CardContent>
          </Card>
          
          {/* Option 3 */}
          <Card className="border-[#f4d58d] shadow-md hover:shadow-lg transition-all">
          <CardContent className="pt-6 px-4 pb-6">
            <div className="flex justify-center mb-4">
            <Gift className="text-[#f4d58d]" size={32} />
            </div>
            
            <h3 className="font-playfair font-semibold text-2xl md:text-3xl mb-2 text-center">$35</h3>
            <h4 className="font-sans text-lg mb-4 text-center">Take My Prayer + Support Another Devotee</h4>
            
            <p className="text-sm mb-6 text-center italic">
            "I want to contribute a little more to help someone who may not be able to. May my prayer and my donation bring blessings to those in need."
            </p>
            
            <Button className="w-full bg-[#f4d58d] hover:bg-[#e3c47c] text-[#333333] px-4 py-2 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all" asChild>
            <a href={buildDigistoreUrl("624610")} target="_blank" rel="noopener noreferrer">
              Send and Help
            </a>
            </Button>
            
            <p className="text-xs mt-3 text-center text-gray-500">
            Thank you for your generosity.
            </p>
          </CardContent>
          </Card>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-lg font-playfair italic">
          "Carry each other's burdens, and in this way you will fulfill the law of Christ."
          </p>
          <p className="text-sm">– Galatians 6:2</p>
        </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 px-2 sm:px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg text-center max-w-4xl">
        <h3 className="text-3xl font-playfair font-semibold mb-6 text-[#333333]">
          Receive the Gift of Miracles Today
        </h3>
        <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
          Place your prayer in the Grotto of Lourdes and trust in the power of divine intervention. 
          Your prayer, delivered personally, will become part of the sacred tradition of this holy place.
        </p>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#333333] text-gray-300 py-12 px-4">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-playfair text-xl mb-4 text-white">Volunteers of Lourdes</h4>
          <p className="text-sm leading-relaxed mb-6">
          Volunteers of Lourdes are part of the Ministry of Devotions. We are not official representatives 
          of the Sanctuary of Lourdes. We are simply volunteers who dedicate time and effort 
          to bring the blessings of Our Lady of Lourdes to those in need.
          </p>
          <p className="text-sm leading-relaxed">
          The content sent (emails, ebooks, and other materials) is for informational and 
          spiritual purposes only. For medical, legal, or psychological matters, please seek a qualified professional.
          </p>
        </div>
        <div className="md:pl-8">
          <h4 className="font-playfair text-xl mb-4 text-white">Important Links</h4>
          <ul className="space-y-2">
          <li>
            <Link to="/termos" className="text-sm hover:text-[#f4d58d] transition-colors">Terms and Conditions</Link>
          </li>
          <li>
            <Link to="/privacidade" className="text-sm hover:text-[#f4d58d] transition-colors">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/contato" className="text-sm hover:text-[#f4d58d] transition-colors">Contact Us</Link>
          </li>
          </ul>
          <div className="mt-8">
          <p className="text-sm text-gray-400">&copy; 2025 Volunteers of Lourdes. All rights reserved.</p>
          </div>
        </div>
        </div>
        
        <div className="mt-8 text-center">
        
        </div>
      </div>
      </footer>

    </div>
    );
};

export default Confirmation;
