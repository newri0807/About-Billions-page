import Image from "next/image";
import styles from "./page.module.css";
import {Metadata} from "next";

type FinancialAsset = {
    ticker: string;
    sharePrice: number;
};

type Billionaire = {
    id: string;
    squareImage: string;
    name: string;
    netWorth: string;
    country: string;
    industries: string;
    bio: string;
    financialAssets: FinancialAsset[];
};

export async function generateMetadata({params}: {params: {id: string}}): Promise<Metadata> {
    const billionaire = await fetchBillionaire(params.id);
    return {
        title: `${billionaire.name} | About Billionaires`,
        description: `Details about ${billionaire.name}, one of the world's billionaires.`,
    };
}

async function fetchBillionaire(id: string): Promise<Billionaire> {
    const response = await fetch(`https://billions-api.nomadcoders.workers.dev/person/${id}`);
    const data = await response.json();
    console.log(data, "-------");
    return data;
}

export default async function PersonPage({params}: {params: {id: string}}) {
    const billionaire = await fetchBillionaire(params.id);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {billionaire?.squareImage ? (
                    <Image src={billionaire.squareImage} alt={billionaire.id} width={400} height={400} className={styles.img} />
                ) : (
                    <Image src="/placeholder.png" alt="Placeholder Image" width={400} height={400} className={styles.img} />
                )}

                <h2 className={styles.title}>{billionaire.name}</h2>
                <p className={styles.detail}>
                    <strong>Net Worth:</strong> ${billionaire.netWorth}
                </p>
                <p className={styles.detail}>
                    <strong>Country:</strong> {billionaire.country}
                </p>
                <p className={styles.detail}>
                    <strong>Industries:</strong> {billionaire.industries}
                </p>
                <p className={styles.detail}>{billionaire.bio}</p>
            </div>
            {billionaire?.financialAssets && (
                <div className={styles.card}>
                    <h2 className={styles.title}>Financial Assets</h2>
                    <ul className={styles.list}>
                        {billionaire?.financialAssets?.map((asset: FinancialAsset) => (
                            <li key={asset.ticker} className={styles.listItem}>
                                <div className={styles.summary}>
                                    <div>Ticker: {asset.ticker}</div>
                                    <div>Shares: ${asset.sharePrice}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
