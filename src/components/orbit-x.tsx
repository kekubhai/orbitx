/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import  Wallet  from "ethereumjs-wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Copy, Wallet as WalletIcon, Key, RefreshCw } from "lucide-react";
import { ThemeToggle } from "./Theme-toggle";
import WordPullUp from "./ui/word-pull-up";
import { VelocityScroll } from "./ui/scroll-based-velocity";
import ShimmerButton from "./ui/shimmer-button";
import Link from "next/link";




export default function OrbitX() {
  const [mnemonicWords, setMnemonicWords] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [importedMnemonic, setImportedMnemonic] = useState("");
  const { toast } = useToast();

  const generateWallet = useCallback(() => {
    try {
      const mnemonic = generateMnemonic();
      const seed = mnemonicToSeedSync(mnemonic);
      const wallet = Wallet.fromPrivateKey(Buffer.from(seed.slice(0, 32)));
      
      setMnemonicWords(mnemonic);
      setPrivateKey(wallet.getPrivateKeyString());
      setPublicKey(wallet.getAddressString());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate wallet. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const importWallet = useCallback(() => {
    try {
      const seed = mnemonicToSeedSync(importedMnemonic);
      const wallet = Wallet.fromPrivateKey(Buffer.from(seed.slice(0, 32)));
      
      setMnemonicWords(importedMnemonic);
      setPrivateKey(wallet.getPrivateKeyString());
      setPublicKey(wallet.getAddressString());
      
      toast({
        title: "Success",
        description: "Wallet imported successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid recovery phrase. Please check and try again.",
        variant: "destructive",
      });
    }
  }, [importedMnemonic, toast]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  }, [toast]);

  const maskString = (str: string) => "•".repeat(str.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-6">

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-background/95 border-accent">
        
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold">
            <WalletIcon className="h-8 w-8 text-primary text-cyan-500" />

            <WordPullUp words={"OrbitX wallet"} className={"text-transparent bg-gradient-to-r from-lime-500 to-fuchsia-300 bg-clip-text"} ></WordPullUp>
            
          </CardTitle>
        </CardHeader>
        <CardContent>
        <VelocityScroll className=" bg-clip-text shadow-lg animate-pulse" text={"Your secure, all-in-one web-based wallet for seamless digital transactions and asset management"}></VelocityScroll>
          <Tabs defaultValue="generate" className="space-y-6 ">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="" value="generate">
                <ShimmerButton  >
                  
                  Generate New Wallet
                  

                  </ShimmerButton>
                  </TabsTrigger>
              <TabsTrigger  value="import">
                <ShimmerButton background="blue" shimmerColor="lime">
                  Import Wallets
                  </ShimmerButton>
                  </TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <div className="space-y-4">
                <Button 
                  onClick={generateWallet}
                
                  className="w-full"
                  size="lg"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                 <h3 className="">
                 Generate New Wallet
                    </h3> 
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="import">
              <div className="space-y-4">
                <Input
                  placeholder="Enter recovery phrase..."
                  value={importedMnemonic}
                  onChange={(e) => setImportedMnemonic(e.target.value)}
                  className="font-mono"
                />
                <Button 
                  onClick={importWallet}
                  className="w-full"
                  size="lg"
                  disabled={!importedMnemonic}
                  >
                  <Key className="mr-2 h-4 w-4" />
                  Import Wallet
                </Button>
              </div>
            </TabsContent>

            {(privateKey || publicKey) && (
              <div className="space-y-4 mt-6">
                <Alert>
                  <AlertDescription className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Recovery Phrase</span>
                      <div className="space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowMnemonic(!showMnemonic)}
                          >
                          {showMnemonic ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(mnemonicWords, "Recovery phrase")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <code className="block p-2 bg-muted rounded-md font-mono text-sm break-all">
                      {showMnemonic ? mnemonicWords : maskString(mnemonicWords)}
                    </code>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertDescription className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Private Key</span>
                      <div className="space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          >
                          {showPrivateKey ? (
                              <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(privateKey, "Private key")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <code className="block p-2 bg-muted rounded-md font-mono text-sm break-all">
                      {showPrivateKey ? privateKey : maskString(privateKey)}
                    </code>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertDescription className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Public Address</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(publicKey, "Public address")}
                        >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <code className="block p-2 bg-muted rounded-md font-mono text-sm break-all">
                      {publicKey}
                    </code>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </Tabs>
        </CardContent>
        
      </Card>
    </div>
  );
}