"use client";

import {useState, useEffect, useRef, useCallback} from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../app/page.module.css";
import {formatNetWorth} from "@/lib/func";

type Billionaire = {
    id: string;
    name: string;
    netWorth: number;
    industries: string;
    squareImage: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchBillionaires() {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    return data;
}

export default function InfiniteScroll() {
    const [allBillionaires, setAllBillionaires] = useState<Billionaire[]>([]);
    const [billionaires, setBillionaires] = useState<Billionaire[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    const itemsPerPage = 10;

    useEffect(() => {
        const loadBillionaires = async () => {
            setLoading(true);
            const data = await fetchBillionaires();
            setAllBillionaires(data);
            setBillionaires(data.slice(0, itemsPerPage));
            setLoading(false);
        };

        loadBillionaires();
    }, []);

    const loadMore = () => {
        setPage((prevPage) => {
            const newPage = prevPage + 1;
            const newBillionaires = allBillionaires.slice(0, newPage * itemsPerPage);
            setBillionaires(newBillionaires);
            if (newBillionaires.length >= allBillionaires.length) {
                setHasMore(false);
            }
            return newPage;
        });
    };

    const lastBillionaireRef = useCallback(
        (node: HTMLLIElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div className={styles.container}>
            <ul className={styles.list}>
                {billionaires.map((billionaire, index) => {
                    const key = `${billionaire.id}-${index}`;
                    if (billionaires.length === index + 1) {
                        return (
                            <li key={key} ref={lastBillionaireRef} className={styles.listItem}>
                                <Link href={`/person/${billionaire.id}`}>
                                    <Image src={billionaire?.squareImage} alt={billionaire.name} width={100} height={100} />
                                    <div className={styles.summary}>
                                        {billionaire.name} <br /> {formatNetWorth(billionaire.netWorth)}/{billionaire.industries}
                                    </div>
                                </Link>
                            </li>
                        );
                    } else {
                        return (
                            <li key={key} className={styles.listItem}>
                                <Link href={`/person/${billionaire.id}`}>
                                    {billionaire?.squareImage ? (
                                        <Image src={billionaire?.squareImage} alt={billionaire.name} width={100} height={100} />
                                    ) : (
                                        <Image src="/placeholder.png" alt="Placeholder Image" width={100} height={100} className={styles.img} />
                                    )}
                                    <div className={styles.summary}>
                                        {billionaire.name} <br /> {formatNetWorth(billionaire.netWorth)}/{billionaire.industries}
                                    </div>
                                </Link>
                            </li>
                        );
                    }
                })}
            </ul>
            {loading && <p className={styles.loading}>Loading...</p>}
            {!hasMore && <p className={styles.hasMore}>No more billionaires to load.</p>}
        </div>
    );
}
