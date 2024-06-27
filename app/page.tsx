import InfiniteScroll from "../components/InfiniteScroll";
import styles from "./page.module.css";

export default function HomePage() {
    return (
        <div className={styles.container}>
            <InfiniteScroll />
        </div>
    );
}
