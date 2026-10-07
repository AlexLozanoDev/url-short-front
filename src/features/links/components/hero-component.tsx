'use client';

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useScramble } from '../hooks/use-scramble';
import { HERO_DEMO_URLS } from '../data/mock-urls';
import { Check, Copy } from 'lucide-react';
import { useShortenUrl } from '@/hooks/use-shorten-url';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function HeroSection() {
  const [urlInput, setUrlInput] = useState('');
  const [currentTitle, setCurrentTitle] = useState(HERO_DEMO_URLS[0]);
  const [hasCopied, setHasCopied] = useState(false);
  const [isShortened, setIsShortened] = useState(false);
  const { displayText, scrambleTo, cancelAnimation, isAnimating } = useScramble({ speed: 25, steps: 18 });
  const { shorten, isLoading } = useShortenUrl();
  
  const hasAnimatedRef = useRef(false);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const runWelcomeSequence = async () => {
      let previousText = HERO_DEMO_URLS[0];

      for (let i = 1; i < HERO_DEMO_URLS.length; i++) {
        await sleep(1000);
        if (isCancelledRef.current) break;

        const targetText = HERO_DEMO_URLS[i];
        await scrambleTo(previousText, targetText);
        if (isCancelledRef.current) break;

        previousText = targetText;
        setCurrentTitle(targetText);
      }
    };

    runWelcomeSequence();
  }, [scrambleTo]);

  const handleShorten = async (e: FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isAnimating || isLoading) return;

    const userUrl = urlInput.trim();
    const alias = null;
    setCurrentTitle(userUrl);

    const result = await shorten(userUrl, alias);

    if (result?.success) {
      
      const realShortUrl = "trmit.site/"+result.data.shortCode;

      
      await scrambleTo(userUrl, realShortUrl);
      setCurrentTitle(realShortUrl);
      setIsShortened(true);
    }
  };
  
  const onChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!isCancelledRef.current) {
      isCancelledRef.current = true;
      cancelAnimation();
    }

    setUrlInput(val);
    setIsShortened(false);
    setCurrentTitle(val.trim() !== '' ? val : 'trmit.app');
  };

  const handleCopy = async () => {
    if (!currentTitle) return;

    try {
      await navigator.clipboard.writeText(currentTitle);
      setHasCopied(true);

      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <section className="flex-1 flex flex-col items-center justify-center self-center w-full space-y-8">
      <h1 className="font-passion text-6xl sm:text-8xl tracking-tight text-center truncate w-full max-w-full select-none min-h-[1.2em]">
        {isAnimating ? displayText : currentTitle}
      </h1>

      <form
        onSubmit={handleShorten}
        className="flex flex-col justify-center w-full space-y-6"
      >
        <Input
          type="url"
          required
          placeholder="Ingresa tu link extra largo"
          value={urlInput}
          onChange={onChangeUrl}
          className="bg-[#d7d7d7] border-0 focus-visible:ring-1 focus-visible:ring-zinc-700 text-[#191919] placeholder:text-zinc-600 h-12 px-6 rounded-xl max-w-xl self-center dark:text-[#e9e9e9]"
        />
        <Button
          type={isShortened ? "button" : "submit"}
          onClick={isShortened ? handleCopy : handleShorten}
          disabled={isAnimating || (!isShortened && !urlInput.trim())}
          className="bg-[#191919] hover:bg-[#808080] text-white font-passion text-lg px-8 h-12 self-center rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 dark:bg-[#e9e9e9] dark:text-black dark:hover:bg-[#808080]"
        >
          {isAnimating ? (
            "Procesando..."
          ) : isShortened ? (
            <>
              {hasCopied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
              {hasCopied ? "¡Copiado!" : "Copiar Enlace"}
            </>
          ) : (
            "Acortalo!"
          )}
        </Button>
      </form>
    </section>
  );
}