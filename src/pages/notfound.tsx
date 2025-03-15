import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function NotFoundPage() {
    return (
        <DefaultLayout>
            <div className="flex flex-col items-center text-center py-16 px-4 space-y-12">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-xl mt-4">Oops! The page you are looking for doesn’t exist.</p>
                <Link href="/">
                    <Button color="primary" variant="bordered" className="mt-6">Go Home</Button>
                </Link>
            </div>
        </DefaultLayout>
    );
}