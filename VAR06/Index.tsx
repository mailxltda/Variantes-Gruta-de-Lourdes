
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, BookText, Heart, HandHeart, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mascarar discretamente o prefixo do e-mail (1 modificação leve) sem tocar no sufixo
function maskEmailPrefix(email: string): string {
  const trimmed = (email || "").trim();
  const at = trimmed.indexOf("@");
  if (at <= 0) return trimmed;

  let local = trimmed.slice(0, at);
  const domain = trimmed.slice(at); // mantém o @ e tudo após

  if (local.length < 3) {
    // muito curto: apenas troca uma letra se possível
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const pos = Math.floor(Math.random() * local.length);
    const ch = local[pos]?.toLowerCase();
    const idx = letters.indexOf(ch);
    if (idx >= 0) {
      const newCh = letters[(idx + 1) % letters.length];
      local = local.slice(0, pos) + newCh + local.slice(pos + 1);
    }
    return local + domain;
  }

  // Dois modos de alteração; use apenas 1 para ser bem discreto
  const rand = Math.random();
  if (rand < 0.5) {
    // Trocar uma letra por outra próxima (apenas se for [a-z])
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let pos = Math.floor(Math.random() * local.length);
    let tries = 0;
    while (tries < 5 && letters.indexOf(local[pos]?.toLowerCase()) === -1) {
      pos = Math.floor(Math.random() * local.length);
      tries++;
    }
    const ch = local[pos]?.toLowerCase();
    const idx = letters.indexOf(ch);
    if (idx >= 0) {
      const newCh = letters[(idx + 1) % letters.length];
      local = local.slice(0, pos) + newCh + local.slice(pos + 1);
    }
  } else {
    // Inverter duas letras vizinhas em posição aleatória
    const pos = Math.floor(Math.random() * (local.length - 1));
    local =
      local.slice(0, pos) +
      local[pos + 1] +
      local[pos] +
      local.slice(pos + 2);
  }

  return local + domain;
}


// Persistência simples no sessionStorage (raw + masked)
const KEY_RAW = "lv_lead_raw_v3";
const KEY_MASKED = "lv_lead_masked_v3";
function saveLead(raw, masked) {
  try {
    sessionStorage.setItem(KEY_RAW, JSON.stringify(raw));
    sessionStorage.setItem(KEY_MASKED, JSON.stringify(masked));
  } catch {}
}

const Index = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      prayer: ""
    }
  });

  const onSubmit = async (data) => {
  setIsSubmitting(true);

  try {


    // Envia o lead para a ActiveCampaign
    await fetch("https://api-email-english.vercel.app/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        prayer: data.prayer
      })
    });

    // Gera headline e parágrafo
    const gptRes = await fetch("https://api-sellpage-eng.vercel.app/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        prayer: data.prayer
      })
    });

    const gptData = await gptRes.json();
    localStorage.setItem("headline", gptData.headline);
    localStorage.setItem("paragraph", gptData.paragraph);

    const name = (data.name || "").trim();
    const emailRaw = (data.email || "").trim();
    const emailMasked = maskEmailPrefix(emailRaw);
    const prayer = (data.prayer || "").trim();

    saveLead(
      { name, email: emailRaw, prayer },                  // RAW (original)
      { name, email: emailMasked, prayer }                // MASKED (prefixo modificado)
    );

    toast({
  title: "✉️ Prayer received",
  description: "Please keep this page open."
});


    // Redireciona para /salvando com nome e gênero
    navigate("/saving", {
      state: {
        nome: data.name,
      }
    });

  } catch (error) {
    console.error("Erro no envio:", error);
    toast({
      title: "Erro",
      description: "Algo deu errado. Tente novamente.",
      variant: "destructive"
    });
  } finally {
    setIsSubmitting(false);
  }
};

  
  
  

const scrollToForm = (event?: MouseEvent) => {
  event?.preventDefault();
  const el = document.getElementById("formulario");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};


  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <HandHeart className="text-[#5f9ea0]" size={24} />
        </div>
        <h1 className="text-xl font-playfair font-semibold text-[#5f9ea0]">Lourdes Volunteers</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
        <a href="#como-funciona" className="text-sm text-gray-700 hover:text-[#5f9ea0] transition-colors">How It Works</a>
        <a href="#por-que-lourdes" className="text-sm text-gray-700 hover:text-[#5f9ea0] transition-colors">Why Lourdes?</a>
        <a href="#formulario" className="text-sm text-gray-700 hover:text-[#5f9ea0] transition-colors">Prayer Form</a>
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
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6 text-[#333333]">
          🕊 Miracles Happen Every Day at the Grotto of Lourdes
        </h2>
        <p className="text-xl md:text-2xl font-playfair mb-6 text-[#5f9ea0]">
          Send Your Prayer Request to the Sacred Grotto of Lourdes, France
        </p>
        <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
          Every year, over 6 million pilgrims travel to the Grotto of Lourdes seeking healing, 
          peace, and divine intervention. Now, your prayer can be delivered to this miraculous place from wherever you are. 
          Allow us to take your message to this sacred sanctuary, where countless miracles have already happened.
        </p>
        <Button 
          asChild
          className="bg-[#5f9ea0] hover:bg-[#4e8a8c] text-white px-8 py-3 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all"
        >
          <a href="#/" onClick={scrollToForm}>
            ➡️ Send My Prayer Request
          </a>
        </Button>
          </div>
        </section>

        

        

        {/* Prayer Form */}
<section id="formulario" className="py-16 px-2 sm:px-4 bg-blue-50">
  <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg sm:max-w-2xl">
    <h3 className="text-3xl font-playfair font-semibold mb-10 text-center text-[#333333]">
      Send Your Prayer to the Grotto of Lourdes
    </h3>
    <Card className="w-full border-[#5f9ea0]/30 shadow-lg">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <Input
              id="name"
              placeholder="Enter your name"
              className="w-full border-[#5f9ea0]/30"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <Input
              id="email"
              placeholder="Enter your email"
              className="w-full border-[#5f9ea0]/30"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="prayer" className="block text-sm font-medium">Your Prayer Intention</label>
            <Textarea
              id="prayer"
              placeholder="Write your prayer here..."
              className="w-full min-h-[150px] border-[#5f9ea0]/30"
              {...register("prayer", { required: "Prayer is required" })}
            />
            {errors.prayer && <p className="text-red-500 text-sm">{errors.prayer.message}</p>}
          </div>

          <div className="pt-4">
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5f9ea0] hover:bg-[#4e8a8c] text-white py-3 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending your prayer...
                </span>
              ) : (
                "Submit my prayer"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</section>


        

        {/* img01 above Main CTA */}
        <section className="py-12 px-2 sm:px-4 bg-white">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-4xl">
            <div className="my-8 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="./img01.jpg" 
                alt="Grotto of Lourdes" 
                className="w-full max-w-none aspect-video object-cover"
              />
            </div>
          </div>
        </section>

        {/* Main CTA */}
        <section className="py-16 md:py-24 px-2 sm:px-4 bg-gradient-to-b from-white to-blue-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg text-center max-w-4xl">
        <h3 className="text-3xl font-playfair font-semibold mb-6 text-[#333333]">
          Receive the Gift of Miracles Today
        </h3>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Place your prayer in the Grotto of Lourdes and trust in the power of divine intervention. 
          Your prayer, delivered in person, will become part of the sacred tradition of this holy place.
        </p>
        <a
          href="#/" onClick={scrollToForm}
          className="inline-block px-6 py-4 bg-[#5f9ea0] hover:bg-[#4e8a8c] text-white rounded-lg text-lg font-medium shadow-md hover:shadow-lg text-center leading-tight"
        >
          ➡️ Send My Prayer<br />to the Grotto of Lourdes
        </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#333333] text-gray-300 py-12 px-2 sm:px-4">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-playfair text-xl mb-4 text-white">Lourdes Volunteers</h4>
          <p className="text-sm leading-relaxed mb-6">
            Lourdes Volunteers are part of the Ministry of Devotions. We are not official representatives 
            of the Sanctuary of Lourdes. We are simply volunteers who dedicate time and effort 
            to bring the blessings of Our Lady of Lourdes to those in need.
          </p>
          <p className="text-sm leading-relaxed">
            The content sent (emails, ebooks, and other materials) is for informational and 
            spiritual purposes only. For medical, legal, or psychological matters, please consult a qualified professional.
          </p>
        </div>
        <div className="md:pl-8">
          <h4 className="font-playfair text-xl mb-4 text-white">Important Links</h4>
          <ul className="space-y-2">
            <li>
          <a href="#" className="text-sm hover:text-[#f4d58d] transition-colors">Terms and Conditions</a>
            </li>
            <li>
          <a href="#" className="text-sm hover:text-[#f4d58d] transition-colors">Privacy Policy</a>
            </li>
            <li>
          <a href="#" className="text-sm hover:text-[#f4d58d] transition-colors">Contact Us</a>
            </li>
          </ul>
          <div className="mt-8">
            <p className="text-sm text-gray-400">&copy; 2025 Lourdes Volunteers. All rights reserved.</p>
          </div>
        </div>
          </div>
        </div>
      </footer>
        </div>
  );
};

export default Index;
