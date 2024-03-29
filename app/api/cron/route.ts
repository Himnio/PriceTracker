import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { NextResponse } from "next/server";

// export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function GET(request: Request) {
  try {
    connectToDB();
    const products = await Product.find({});
    if (!products) throw new Error("No product fetched");

    //Scrape the latest product details and updated the db;
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapAmazonProduct(currentProduct.url);
        if (!scrapedProduct) return;

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          product
        );

        // Check each product's and send email accordingly
        const emailNotifiType = getEmailNotifType(
          scrapedProduct,
          currentProduct
        );
        if (emailNotifiType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(productInfo, emailNotifiType);

          const userEmail = updatedProduct.users.map(
            (users: any) => users.email
          );

          await sendEmail(emailContent, userEmail);
        }

        return updatedProduct;
      })
    );
    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`Failed to get all products ${error}`);
  }
}
