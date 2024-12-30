import React, { useState } from "react";

import * as bip39 from "bip39";
import { useNavigate } from "react-router-dom";
import { Copy, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

const SolanaVault: React.FC = () => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const generateMnemonic = () => {
    try {
      const generatedMnemonic = bip39.generateMnemonic();
      setMnemonic(generatedMnemonic);
      setError(null);
    } catch (err) {
      setError("Failed to generate mnemonic");
      console.error(err);
    }
  };

  const handleCopyMnemonic = async () => {
    if (mnemonic) {
      try {
        await navigator.clipboard.writeText(mnemonic);
        alert("Mnemonic copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy mnemonic:", err);
      }
    }
  };

  const handleNext = () => {
    if (mnemonic) {
      localStorage.setItem("seedPhrase", mnemonic);
      navigate("/wallets");
    } else {
      setError("Mnemonic is required");
    }
  };

  const formatMnemonic = (mnemonic: string) => mnemonic.split(" ");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          onClick={() => window.open("https://crypto.com/university/crypto-wallets", "_blank")}
        >
          <Info className="mr-2" /> Learn More
        </Button>
      </div>

      <Card className="max-w-lg shadow-xl bg-white">
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-800">Welcome to SolanaVault</h1>
        </CardHeader>

        <CardContent>
          {!mnemonic ? (
            <Button onClick={generateMnemonic} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Generate Mnemonic
            </Button>
          ) : (
            <div>
              <div className="grid grid-cols-4 gap-2 p-4 bg-gray-100 rounded-md">
                {formatMnemonic(mnemonic).map((word, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-blue-500 text-white text-center rounded-md shadow-sm"
                  >
                    {word}
                  </div>
                ))}
              </div>
              <div className="flex flex-col mt-4 gap-2">
                <Button onClick={handleCopyMnemonic} className="bg-green-600 text-white hover:bg-green-700">
                  <Copy className="mr-2" /> Copy Mnemonic
                </Button>
                <Button onClick={handleNext} className="bg-blue-600 text-white hover:bg-blue-700">
                  Next
                </Button>
              </div>
            </div>
          )}

          {error && (
            <Alert className="mt-4 bg-red-100 text-red-700">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-md shadow-sm">
            <h2 className="text-gray-700 font-semibold">About SolanaVault</h2>
            <p className="text-gray-600 text-sm mt-2">
              {mnemonic
                ? "If you already have a previous mnemonic, you can import it on the next page."
                : "SolanaVault is your secure gateway for Solana assets. Generate your mnemonic and start transacting with ease."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolanaVault;
